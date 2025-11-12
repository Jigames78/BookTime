-- ========================================
-- 📚 BOOKTIME - SCRIPT DE CRÉATION D'UTILISATEURS
-- ========================================
-- Ce script permet de créer des utilisateurs pour BookTime
-- Les mots de passe sont automatiquement chiffrés par Supabase
-- ========================================

-- 🔐 FONCTION HELPER POUR CRÉER UN UTILISATEUR
CREATE OR REPLACE FUNCTION create_booktime_user(
  p_username TEXT,
  p_password TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
  user_email TEXT;
BEGIN
  -- Construire l'email fictif
  user_email := p_username || '@booktime.local';
  
  -- Créer l'utilisateur
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_confirmed_at,
    recovery_token,
    aud
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    jsonb_build_object('username', p_username),
    NOW(),
    NOW(),
    '',
    NOW(),
    '',
    'authenticated'
  )
  RETURNING id INTO new_user_id;
  
  -- Créer l'identité associée
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', user_email
    ),
    'email',
    NOW(),
    NOW(),
    NOW()
  );
  
  RAISE NOTICE '✅ Utilisateur créé : % (ID: %)', p_username, new_user_id;
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 📝 EXEMPLES D'UTILISATION
-- ========================================

-- CRÉER UN UTILISATEUR
-- Syntaxe : SELECT create_booktime_user('nom_utilisateur', 'mot_de_passe');

-- Exemple 1 : Utilisateur "alice"
SELECT create_booktime_user('alice', 'MotDePasse123!');

-- Exemple 2 : Utilisateur "bob"
SELECT create_booktime_user('bob', 'SecurePass456!');

-- Exemple 3 : Utilisateur "charlie"
SELECT create_booktime_user('charlie', 'MyPassword789!');

-- ========================================
-- 🔍 VÉRIFIER LES UTILISATEURS CRÉÉS
-- ========================================

SELECT 
  id,
  email,
  raw_user_meta_data->>'username' as username,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email LIKE '%@booktime.local'
ORDER BY created_at DESC;

-- ========================================
-- 🗑️ SUPPRIMER UN UTILISATEUR (SI BESOIN)
-- ========================================

-- Fonction pour supprimer un utilisateur
CREATE OR REPLACE FUNCTION delete_booktime_user(p_username TEXT)
RETURNS VOID AS $$
DECLARE
  user_id_to_delete UUID;
BEGIN
  -- Trouver l'ID de l'utilisateur
  SELECT id INTO user_id_to_delete
  FROM auth.users
  WHERE email = p_username || '@booktime.local';
  
  IF user_id_to_delete IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé: %', p_username;
  END IF;
  
  -- Supprimer les livres de l'utilisateur
  DELETE FROM books WHERE user_id = user_id_to_delete;
  
  -- Supprimer l'identité
  DELETE FROM auth.identities WHERE user_id = user_id_to_delete;
  
  -- Supprimer l'utilisateur
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RAISE NOTICE '✅ Utilisateur supprimé : %', p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemple d'utilisation :
-- SELECT delete_booktime_user('alice');

-- ========================================
-- 🔐 CHANGER LE MOT DE PASSE D'UN UTILISATEUR
-- ========================================

CREATE OR REPLACE FUNCTION change_booktime_password(
  p_username TEXT,
  p_new_password TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET 
    encrypted_password = crypt(p_new_password, gen_salt('bf')),
    updated_at = NOW()
  WHERE email = p_username || '@booktime.local';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Utilisateur non trouvé: %', p_username;
  END IF;
  
  RAISE NOTICE '✅ Mot de passe changé pour : %', p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemple d'utilisation :
-- SELECT change_booktime_password('alice', 'NouveauMotDePasse!');

-- ========================================
-- 📊 STATISTIQUES PAR UTILISATEUR
-- ========================================

SELECT 
  u.raw_user_meta_data->>'username' as username,
  u.email,
  COUNT(b.id) as nombre_livres,
  u.created_at,
  u.last_sign_in_at
FROM auth.users u
LEFT JOIN books b ON b.user_id = u.id
WHERE u.email LIKE '%@booktime.local'
GROUP BY u.id, u.email, u.raw_user_meta_data, u.created_at, u.last_sign_in_at
ORDER BY u.created_at DESC;
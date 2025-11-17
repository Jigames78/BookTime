GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

GRANT SELECT ON auth.users TO postgres, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NULLIF(
    COALESCE(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    ),
    ''
  )::uuid
$$;

GRANT EXECUTE ON FUNCTION auth.uid() TO postgres, anon, authenticated, service_role;

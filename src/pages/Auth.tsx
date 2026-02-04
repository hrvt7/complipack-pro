import { Helmet } from 'react-helmet-async';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function Auth() {
  return (
    <>
      <Helmet>
        <title>Sign Up / Log In - CompliPack</title>
        <meta
          name="description"
          content="Create your CompliPack account or log in to access your EU compliance dashboard."
        />
      </Helmet>
      <AuthLayout />
    </>
  );
}

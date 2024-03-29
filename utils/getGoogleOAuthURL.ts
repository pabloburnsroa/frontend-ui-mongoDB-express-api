function getGoogleOAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL as string,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  };
  // console.log(options);
  const qs = new URLSearchParams(options);
  // console.log(qs.toString());
  return `${rootUrl}?${qs.toString()}`;
}

export default getGoogleOAuthURL;

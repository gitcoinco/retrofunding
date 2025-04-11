import { Helmet } from "react-helmet-async";

type TwitterCardType = "summary" | "summary_large_image" | "app" | "player";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterCard?: TwitterCardType;
}

export const SEO = ({
  title = "Vote | Retrofunding",
  description = "Powered by Gitcoin",
  image = "https://beta.rf.vote.gitcoin.co/gitcoin.svg",
  url = "https://beta.rf.vote.gitcoin.co",
  type = "website",
  twitterCard = "summary_large_image",
}: SEOProps) => {
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

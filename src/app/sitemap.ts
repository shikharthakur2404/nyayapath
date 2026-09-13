import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nyayapath.in';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}?lang=en`,
          hi: `${baseUrl}?lang=hi`,
          pa: `${baseUrl}?lang=pa`,
          mr: `${baseUrl}?lang=mr`,
          bn: `${baseUrl}?lang=bn`,
          ta: `${baseUrl}?lang=ta`,
          te: `${baseUrl}?lang=te`,
          gu: `${baseUrl}?lang=gu`,
          kn: `${baseUrl}?lang=kn`,
        },
      },
    },
  ];
}

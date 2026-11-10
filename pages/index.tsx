import { GetStaticProps } from "next";
import ResearchCard from "../components/ResearchCard";
import categoriesData from "../lib/categories.json";

interface Author {
  name: string;
  avatar: string;
  twitter?: string;
  url?: string;
  promotedToResident?: boolean;
}

interface ResearchCategory {
  title: string;
  description: string;
  contentPath?: string;
  authors?: Author[];
  href?: string;
  external?: boolean;
  seo: {
    title: string;
    keywords: string[];
    baseUrl: string;
  };
}

interface HomeProps {
  categories: Record<string, ResearchCategory>;
}

export default function Home({ categories }: HomeProps) {

  return (
    <div className="bg-background">
      {/* The same side margins as the navbar (components/Navbar.tsx), so the
          cards start under the logo and end under the Contact button. */}
      <main className="py-12 px-6 min-[1150px]:px-[max(2rem,min(20vw,calc((100vw_-_1000px)/2)))]">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="text-6xl font-bold text-title mb-4">Explore <span className="text-deepblue">Research</span></h1>
          <p className="text-xl text-body">Advanced security research for Web3 and cryptographic systems</p>
        </div>

        {/* Research Categories Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categories)?.map(([key, category]) => (
              <ResearchCard
                key={key}
                category={key}
                title={category.title}
                description={category.description}
                authors={category.authors}
                href={category.href ?? `/${key}`}
                external={category.external}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      categories: categoriesData.categories,
    },
    revalidate: 3600,
  };
};

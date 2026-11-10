import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, BookOpen, Target, Key } from "lucide-react";

interface Author {
  name: string;
  avatar: string;
  twitter?: string;
  url?: string;
  promotedToResident?: boolean;
}

interface ResearchCategoryProps {
  category: string;
  title: string;
  description: string;
  authors?: Author[];
  href: string;
  external?: boolean;
}

const ResearchCard: React.FC<ResearchCategoryProps> = ({
  category,
  title,
  description,
  authors = [],
  href,
  external = false,
}) => {
  const getIcon = () => {
    switch (category) {
      case "proxies":
        return <Shield className="h-12 w-12 text-deepblue" />;
      case "mpc":
        return <Target className="h-12 w-12 text-deepblue" />;
      case "multisig-security":
        return <Key className="h-12 w-12 text-deepblue" />;
      default:
        return <BookOpen className="h-12 w-12 text-deepblue" />;
    }
  };

  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block p-8"
    >
      <div className="flex items-center">
        {getIcon()}
        <div className="ml-4 text-left">
          <h3 className="text-2xl font-bold text-black group-hover:text-deepblue transition-colors">
            {title}
          </h3>
        </div>
      </div>

      <p className="text-body text-md mt-6 text-left">
        {description}
      </p>

      {/* Authors Section */}
      {authors.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-body mb-3">Authors:</p>
          <div className="flex items-center space-x-3">
            {authors.map((author, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm text-body">{author.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResearchCard;

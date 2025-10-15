import Image from 'next/image';

interface SetAngebotProps {
  productName: string;
  productImage: string;
  basePrice: number;
  regularPrice: number;
  einheit: string;
  daemmungName: string;
  daemmungImage: string;
  daemmungPrice: number;
  // NEU:
  sockelleisteName: string;
  sockelleisteImage: string;
  sockelleistePrice: number;
}

export default function SetAngebot({
  productName,
  productImage,
  basePrice,
  regularPrice,
  einheit,
  daemmungName,
  daemmungImage,
  daemmungPrice,
  sockelleisteName,
  sockelleisteImage,
  sockelleistePrice
}: SetAngebotProps) {
  // Check if we have at least one addition product (not a placeholder)
  const hasDaemmung = daemmungName !== 'Trittschalldämmung';
  const hasSockelleiste = sockelleisteName !== 'Sockelleiste';

  // Don't render if no addition products
  if (!hasDaemmung && !hasSockelleiste) {
    return null;
  }

  // Calculate grid columns based on number of products
  const productCount = 1 + (hasDaemmung ? 1 : 0) + (hasSockelleiste ? 1 : 0);
  const gridCols = productCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      {/* Boden Card */}
      <div className="bg-white rounded-lg p-4">
        <div className="text-center mb-2">
          <span className="text-sm text-gray-600">Boden</span>
        </div>
        <Image
          src={productImage}
          alt={productName}
          width={160}
          height={160}
          className="mx-auto rounded-lg mb-3"
        />
        <h3 className="text-sm font-medium mb-2 text-center">
          {productName}
        </h3>
        <div className="text-center">
          <span className="text-gray-400 line-through text-sm">
            {regularPrice.toFixed(2)}€
          </span>
          <span className="text-red-600 font-bold text-lg ml-2">
            {basePrice.toFixed(2)}€/{einheit}
          </span>
        </div>
      </div>

      {/* Dämmung Card - Only show if product exists */}
      {hasDaemmung && (
        <div className="bg-white rounded-lg p-4">
          <div className="text-center mb-2">
            <span className="text-sm text-gray-600">Dämmung</span>
          </div>
          <Image
            src={daemmungImage}
            alt={daemmungName}
            width={160}
            height={160}
            className="mx-auto rounded-lg mb-3"
          />
          <h3 className="text-sm font-medium mb-2 text-center">
            {daemmungName}
          </h3>
          <div className="text-center">
            <span className="text-red-600 font-bold text-lg">
              {daemmungPrice.toFixed(2)}€/{einheit}
            </span>
          </div>
        </div>
      )}

      {/* Sockelleiste Card - Only show if product exists */}
      {hasSockelleiste && (
        <div className="bg-white rounded-lg p-4">
          <div className="text-center mb-2">
            <span className="text-sm text-gray-600">Sockelleiste</span>
          </div>
          <Image
            src={sockelleisteImage}
            alt={sockelleisteName}
            width={160}
            height={160}
            className="mx-auto rounded-lg mb-3"
          />
          <h3 className="text-sm font-medium mb-2 text-center">
            {sockelleisteName}
          </h3>
          <div className="text-center">
            <span className="text-red-600 font-bold text-lg">
              {sockelleistePrice.toFixed(2)}€/{einheit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

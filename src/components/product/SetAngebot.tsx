import Image from 'next/image';

interface SetAngebotProps {
  productName: string;
  productImage: string;
  basePrice: number;
  regularPrice: number;
  einheit: string;
}

export default function SetAngebot({
  productName,
  productImage,
  basePrice,
  regularPrice,
  einheit
}: SetAngebotProps) {
  return (
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
  );
}

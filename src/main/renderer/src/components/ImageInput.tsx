import defaultImage from "@/assets/images/defaultUser.png";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

const ImageInput = ({name, id} : {name: string, id: string}) => {
    const [imageUrl, setImageUrl] = useState<string | null>()
    const fileInputRef: any = useRef()

      // Handle Profile Image Upload
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center h-[100px] mb-4">
    <div className="relative">
      <img
        id={id}
        src={imageUrl || defaultImage}
        alt="Profile"
        className="h-full w-[100px] object-cover rounded-full border border-gray-300 shadow-md"
      />

      <button
        type="button"
        onClick={() => !imageUrl && fileInputRef.current.click()}
        className="absolute cursor-pointer bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full"
      >
        {!imageUrl ? (
          <Upload className="w-4 h-4" />
        ) : (
          <X
            className="w-4 h-4"
            onClick={() => setImageUrl(null)}
          />
        )}
      </button>
    </div>
    <input
      ref={fileInputRef as any}
      onChange={handleImageChange}
      type="file"
      name={name}
      id="fileInput"
      accept="image/*"
      className="hidden"
    />
  </div>
  )
}

export default ImageInput
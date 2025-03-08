import React from "react";
import { useToast } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

interface CopyToClipboardProps {
  textToCopy: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ textToCopy }) => {
  const toast = useToast({
    position: "bottom",
    title: "Copied!",
    description: "Text has been copied to clipboard.",
    status: "success",
    duration: 2000,
    isClosable: true,
    colorScheme: "blackAlpha.900",

    containerStyle: {
      width: "200px",
      maxWidth: "100%",
      background: "blackAlpha.900",
    },
  });

  const handleCopy = async () => {
    console.log("first");

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        containerStyle: {
          width: "200px",
          maxWidth: "100%",
          backgroundColor: "blackAlpha.900",
        },
      });
      console.log("done");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy text.",
        status: "error",
        duration: 2000,
        colorScheme: "red",
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faCopy}
        onClick={handleCopy}
        className="cursor-pointer hover:text-slate-500"
      />
    </>
  );
};

export default CopyToClipboard;

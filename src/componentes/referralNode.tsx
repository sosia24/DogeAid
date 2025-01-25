import React, { useState, useEffect } from "react";
import { fetchReferralTree } from "@/services/Web3Services";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

// Tipo para representar o nó da árvore
interface ReferralNodeType {
  address: string | null;
  children?: ReferralNodeType[];
}

function getBackgroundColor(level: number): string {
  const baseRed = 246;
  const baseGreen = 13;
  const baseBlue = 81;

  const red = Math.min(baseRed + level * 15, 255);
  const green = Math.min(baseGreen + level * 10, 150);
  const blue = Math.min(baseBlue + level * 10, 200);
  const opacity = Math.max(1 - level * 0.1, 0);

  return `rgb(${red}, ${green}, ${blue}, ${opacity})`;
}

interface ReferralNodeProps {
  node: ReferralNodeType;
  level?: number;
}

const ReferralNode: React.FC<ReferralNodeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!node) return null;

  const childrenCount = node.children?.length || 0;
  const backgroundColor = getBackgroundColor(level);

  return (
    <div className="w-full flex flex-col items-start mb-6 sm:text-[15px] text-lg">
      <div className="flex justify-between items-center w-full mb-2">
        <div
          className="text-white px-4 py-2 rounded shadow-md flex items-center w-full"
          style={{ backgroundColor }}
        >
          <span className="bg-gray-700 mr-[4px] text-white px-2 py-1 text-xs rounded">
            Lvl {level}
          </span>
          <span className="truncate">
            {node.address
              ? `${node.address.slice(0, 6)}...${node.address.slice(-4)}`
              : "N/A"}
          </span>
          <div className="flex space-x-2 items-center ml-4">
            <button
              className="bg-green-500 flex items-center text-white px-2 py-1 text-xs rounded"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {childrenCount}{" "}
              {isExpanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && node.children && (
        <div className="flex flex-col mt-4 pl-6 w-full">
          {node.children.map((child, index) => (
            <ReferralNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ReferralTreeProps {
  address: string;
}

const ReferralTree: React.FC<ReferralTreeProps> = ({ address }) => {
  const [tree, setTree] = useState<ReferralNodeType | null>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    async function loadTree() {
      if (!address) return;
      try {
        const fetchedTree = await fetchReferralTree(address);
        setTree(fetchedTree[0]);
        
        setQuantity(fetchedTree[1]-1);
        
      } catch (error) {
        console.error("Erro ao carregar a árvore de referências:", error);
      }
    }
    loadTree();
  }, [address]);

  return (
    <div className="p-8 sm:p-4 bg-red-800 bg-opacity-40 rounded-2xl w-[80%] sm:w-[96%]">
      <h1 className="text-2xl sm:text-xl font-bold text-center mb-6">
        <button className="bg-[#f60d51] shadow-xl rounded-3xl w-[150px] h-[40px] font-semibold text-[18px]">
          Team
        </button>
      </h1>
      <h1 className="my-2">          Total affiliated: {quantity}
      </h1>
      {tree ? (
        <div className="flex flex-col items-start w-full">
          <ReferralNode node={tree} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default ReferralTree;
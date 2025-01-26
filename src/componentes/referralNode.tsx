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
interface ReferralTreeProps {
  address: string; // O componente precisa receber 'address' como prop
}

const ReferralNode: React.FC<ReferralNodeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!node) return null;

  const childrenCount = node.children?.length || 0;
  const backgroundColor = getBackgroundColor(level);

  return (
    <div
      className={`w-full flex flex-col items-start mb-6 text-base transition-all overflow-x-hidden ${
        level === 0 ? "sm:text-lg" : "sm:text-sm"
      }`}
    >
      {/* Nó principal com evento onClick para expandir/recolher */}
      <div
        className={`flex justify-between items-center w-full mb-2 transition-all cursor-pointer`}
        style={{
          paddingLeft: level === 0 ? 0 : Math.min(level * 16, 64), // Limita o recuo no desktop
        }}
        onClick={() => setIsExpanded(!isExpanded)} // Adiciona o evento de clique para expandir/recolher
      >
        <div
          className="text-white px-3 py-2 rounded shadow-md flex items-center w-full max-w-full hover:shadow-lg hover:scale-[1.02] transition-transform"
          style={{ backgroundColor }}
        >
          <span className="bg-gray-700 mr-2 text-white px-2 py-1 text-xs rounded">
            Lvl {level}
          </span>
          <span className="truncate flex-1">
            {node.address
              ? `${node.address.slice(0, 6)}...${node.address.slice(-4)}`
              : "N/A"}
          </span>
          <div className="bg-green-500 flex items-center text-white px-2 py-1 text-xs rounded ml-2 hover:bg-green-400">
            {childrenCount}{" "}
            {isExpanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          </div>
        </div>
      </div>

      {/* Nós filhos */}
      {isExpanded && node.children && (
        <div
          className={`flex flex-col border-l-2 border-gray-400 pl-4 sm:pl-2 mt-2`}
          style={{
            marginLeft: level === 0 ? 0 : 16,
          }}
        >
          {node.children.map((child, index) => (
            <ReferralNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};


const ReferralTree: React.FC<ReferralTreeProps> = ({ address }) => {
  const [tree, setTree] = useState<ReferralNodeType | null>(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    async function loadTree() {
      if (!address) return;
      try {
        const fetchedTree = await fetchReferralTree(address);
        setTree(fetchedTree[0]);
        setQuantity(fetchedTree[1] - 1);
      } catch (error) {
        console.error("Erro ao carregar a árvore de referências:", error);
      }
    }
    loadTree();
  }, [address]);

  return (
    <div className="p-8 sm:p-4 bg-red-800 bg-opacity-40 rounded-2xl w-[80%] sm:w-[96%] overflowy-auto  mx-auto">
      <h1 className="text-3xl sm:text-xl font-bold text-center mb-6">
        <button className="bg-[#f60d51] shadow-xl rounded-3xl w-[150px] h-[40px] font-semibold text-[18px] hover:bg-[#e10c4a] transition-colors">
          Team
        </button>
      </h1>
      <h1 className="my-2 text-center sm:text-left">
        Total affiliated: {quantity}
      </h1>
      {tree ? (
        <div className="flex flex-col items-start w-full overflow-x-auto">
          <ReferralNode node={tree} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default ReferralTree;


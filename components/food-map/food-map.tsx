"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FoodMapCard, FoodMapCardProps } from "./food-map-card";
import { ChevronLeft, ChevronRight, ChefHat, Bike, MapPin } from "lucide-react";

const options: FoodMapCardProps[] = [
  {
    mode: "cook",
    title: "Paneer Tikka Bowl",
    description: "30-min home recipe with paneer, peppers, and yogurt marinade.",
    price: "₹280",
    time: "30 min",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "order",
    title: "Biryani Box",
    description: "From your favorite local kitchen, delivered in 35 minutes.",
    price: "₹320",
    time: "35 min",
    icon: Bike,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "dineout",
    title: "Andhra Spice",
    description: "Casual family restaurant, 1.2 km away, 4.5 rating.",
    price: "₹450",
    time: "15 min walk",
    icon: MapPin,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "cook",
    title: "Masala Dosa Night",
    description: "Crispy dosa with coconut chutney and sambar at home.",
    price: "₹180",
    time: "25 min",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1669568513180-0a4f29d66a0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    mode: "order",
    title: "Rolls & Wraps",
    description: "Kathi rolls, delivered hot in 25 minutes.",
    price: "₹240",
    time: "25 min",
    icon: Bike,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
  },
];

export function FoodMap() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="food-map-scroll flex gap-5 overflow-x-auto pb-4 pt-2"
      >
        {options.map((o, i) => (
          <motion.div
            key={o.title}
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <FoodMapCard {...o} />
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-flour shadow-md ring-1 ring-border hover:shadow-lg lg:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-flour shadow-md ring-1 ring-border hover:shadow-lg lg:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

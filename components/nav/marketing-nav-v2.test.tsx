import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MarketingNavV2 } from "./marketing-nav-v2";

describe("MarketingNavV2", () => {
  it("renders the MealMap brand and auth links", () => {
    render(<MarketingNavV2 />);

    expect(screen.getByText("MealMap")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get started/i })).toBeInTheDocument();
  });

  it("has CTA buttons with a minimum 44px touch target", () => {
    render(<MarketingNavV2 />);

    const signIn = screen.getByRole("link", { name: /Sign in/i });
    const getStarted = screen.getByRole("link", { name: /Get started/i });

    expect(signIn.className).toMatch(/\bh-11\b/);
    expect(getStarted.className).toMatch(/\bh-11\b/);
  });
});

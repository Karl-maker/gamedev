import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FlagSelect } from "@/components/contact/flag-select";

const options = [
  { id: "TT", value: "Trinidad and Tobago", countryCode: "TT", label: "Trinidad and Tobago", secondary: "TT" },
  { id: "GB", value: "United Kingdom", countryCode: "GB", label: "United Kingdom", secondary: "GB" }
];

describe("flag selector", () => {
  it("shows flag images in a searchable custom list", () => {
    const onChange = vi.fn();
    render(<FlagSelect options={options} value="" onChange={onChange} placeholder="Select country" ariaLabel="Country" />);
    fireEvent.click(screen.getByRole("button", { name: "Country" }));

    const trinidad = screen.getByRole("option", { name: /Trinidad and Tobago/ });
    expect(trinidad.querySelector("img")).toHaveAttribute("src", "https://flagcdn.com/tt.svg");

    fireEvent.change(screen.getByRole("searchbox", { name: "Search country" }), { target: { value: "United" } });
    expect(screen.queryByRole("option", { name: /Trinidad and Tobago/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("option", { name: /United Kingdom/ }));
    expect(onChange).toHaveBeenCalledWith("GB");
  });
});

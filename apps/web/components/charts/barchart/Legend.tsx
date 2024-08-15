"use client";

import {
  forwardRef,
  OlHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AvailableChartColors,
  AvailableChartColorsKeys,
} from "@/utils/chartUtils";
import { cn } from "@openstudio/ui/lib/utils";
import { LegendItem } from "./LegendItem";
import { ScrollButton } from "./ScrollButton";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

interface LegendProps extends OlHTMLAttributes<HTMLOListElement> {
  categories: string[];
  colors?: AvailableChartColorsKeys;
  onClickLegendItem?: (category: string, color: string) => void;
  activeLegend?: string;
  enableLegendSlider?: boolean;
}

type HasScrollProps = {
  left: boolean;
  right: boolean;
};

export const Legend = forwardRef<HTMLOListElement, LegendProps>(
  (props, ref) => {
    const {
      categories,
      colors = AvailableChartColors,
      className,
      onClickLegendItem,
      activeLegend,
      enableLegendSlider = false,
      ...other
    } = props;

    const scrollableRef = useRef<HTMLInputElement>(null);
    const [hasScroll, setHasScroll] = useState<HasScrollProps | null>(null);
    const [isKeyDowned, setIsKeyDowned] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const checkScroll = useCallback(() => {
      const scrollable = scrollableRef.current;
      if (!scrollable) return;

      const hasLeftScroll = scrollable.scrollLeft > 0;
      const hasRightScroll =
        scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

      setHasScroll({ left: hasLeftScroll, right: hasRightScroll });
    }, [setHasScroll]);

    const scrollToTest = useCallback(
      (direction: "left" | "right") => {
        const element = scrollableRef.current;
        const width = element?.clientWidth ?? 0;

        if (element && enableLegendSlider) {
          element.scrollTo({
            left:
              direction === "left"
                ? element.scrollLeft - width
                : element.scrollLeft + width,
          });
          setTimeout(() => {
            checkScroll();
          }, 400);
        }
      },
      [enableLegendSlider, checkScroll],
    );

    useEffect(() => {
      const keyDownHandler = (key: string) => {
        if (key === "ArrowLeft") {
          scrollToTest("left");
        } else if (key === "ArrowRight") {
          scrollToTest("right");
        }
      };
      if (isKeyDowned) {
        keyDownHandler(isKeyDowned);
        intervalRef.current = setInterval(() => {
          keyDownHandler(isKeyDowned);
        }, 300);
      } else {
        clearInterval(intervalRef.current as ReturnType<typeof setTimeout>);
      }

      return () =>
        clearInterval(intervalRef.current as ReturnType<typeof setTimeout>);
    }, [isKeyDowned, scrollToTest]);

    const keyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setIsKeyDowned(null);
      }
    };

    const keyUp = (e: KeyboardEvent) => {
      e.stopPropagation();
      setIsKeyDowned(null);
    };

    useEffect(() => {
      const scrollable = scrollableRef?.current;
      if (enableLegendSlider) {
        checkScroll();
        scrollable?.addEventListener("keydown", keyDown);
        scrollable?.addEventListener("keyup", keyUp);
      }

      return () => {
        scrollable?.removeEventListener("keydown", keyDown);
        scrollable?.removeEventListener("keyup", keyUp);
      };
    }, [checkScroll, enableLegendSlider]);

    return (
      <ol
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...other}
      >
        <div
          ref={scrollableRef}
          tabIndex={0}
          className={cn(
            "flex h-full",
            enableLegendSlider
              ? hasScroll?.right || hasScroll?.left
                ? "snap-mandatory items-center overflow-auto pl-4 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                : ""
              : "flex-wrap",
          )}
        >
          {categories.map((category, index) => (
            <LegendItem
              key={`item-${index}`}
              name={category}
              color={colors[index] as AvailableChartColorsKeys}
              onClick={onClickLegendItem}
              activeLegend={activeLegend}
            />
          ))}
        </div>
        {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
          <>
            <div>
              <ScrollButton
                icon={RiArrowLeftSLine}
                onClick={() => {
                  setIsKeyDowned(null);
                  scrollToTest("left");
                }}
                disabled={!hasScroll?.left}
              />
              <ScrollButton
                icon={RiArrowRightSLine}
                onClick={() => {
                  setIsKeyDowned(null);
                  scrollToTest("right");
                }}
                disabled={!hasScroll?.right}
              />
            </div>
          </>
        ) : null}
      </ol>
    );
  },
);

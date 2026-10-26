import { useQuery } from "@tanstack/react-query";
import { CircleUser, X as XIcon, LogOut } from "lucide-react";
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logoMark from "@/assets/logo-mark.svg";
import { useMobileNav } from "@/components/MobileNavProvider";
import { useSearchPalette } from "@/components/SearchPalette";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useI18n } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { filterConversations, conversationTitle, conversationDayLabel } from "@/lib/conversations";
import { cn } from "@/lib/utils";

const sa =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M11.6667%201.66667C12.3959%201.79903%2012.9327%202.03313%2013.357%202.4472C14.3333%203.39991%2014.3333%204.93327%2014.3333%208C14.3333%2011.0667%2014.3333%2012.6001%2013.357%2013.5528C12.9327%2013.9669%2012.3959%2014.201%2011.6667%2014.3333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M4.2069%201.83429C3.51219%201.96314%203.0009%202.19105%202.59669%202.59416C2.19248%202.99727%201.96395%203.50717%201.83474%204.2M9.33333%201.66997C8.94267%201.66667%208.47447%201.66667%208.01727%201.66667C7.56007%201.66667%207.05007%201.66667%206.6594%201.66997M1.66998%206.73333C1.66667%207.12293%201.66667%207.54407%201.66667%208C1.66667%208.45593%201.66667%208.87707%201.66998%209.26673M1.83474%2011.8C1.96395%2012.4928%202.19247%2013.0027%202.59669%2013.4059C3.0009%2013.8089%203.51219%2014.0369%204.2069%2014.1657M9.33333%2014.33C8.94267%2014.3333%208.47447%2014.3333%208.01727%2014.3333C7.56013%2014.3333%207.05007%2014.3333%206.6594%2014.33'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M8%201.66667V2.66667M8%2013.3333V14.3333M10%208H6M2.97917%208H2M8%206V10'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const aa =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_85)'%3e%3cpath%20id='Vector'%20d='M4.66667%209.33333C3.5621%209.33333%202.66667%2010.2287%202.66667%2011.3333C2.66667%2012.4379%203.5621%2013.3333%204.66667%2013.3333C4.90043%2013.3333%205.12481%2013.2932%205.33333%2013.2195'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M2.84261%2010.4031C1.94953%209.97213%201.33336%209.058%201.33336%208C1.33336%207.1922%201.69251%206.46834%202.25985%205.97932'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M2.28035%205.92547C2.10327%205.66073%202%205.34242%202%205C2%204.07953%202.74619%203.33333%203.66667%203.33333C4.04194%203.33333%204.38825%203.45736%204.66683%203.66667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M4.82513%203.71022C4.72349%203.49477%204.66667%203.25402%204.66667%203C4.66667%202.07953%205.41286%201.33333%206.33333%201.33333C7.2538%201.33333%208%202.07953%208%203V13.3333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M5.33333%2013.3333C5.33333%2014.0697%205.93029%2014.6667%206.66667%2014.6667C7.40307%2014.6667%208%2014.0697%208%2013.3333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_6'%20d='M8%204.66667C8%205.77123%208.8954%206.66667%2010%206.66667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_7'%20d='M11.3333%209.33333C12.4379%209.33333%2013.3333%2010.2287%2013.3333%2011.3333C13.3333%2012.4379%2012.4379%2013.3333%2011.3333%2013.3333C11.0996%2013.3333%2010.8752%2013.2932%2010.6667%2013.2195'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_8'%20d='M13.1574%2010.4031C14.0505%209.97213%2014.6667%209.058%2014.6667%208C14.6667%207.1922%2014.3075%206.46834%2013.7401%205.97932'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_9'%20d='M13.7197%205.92547C13.8967%205.66073%2014%205.34242%2014%205C14%204.07953%2013.2538%203.33333%2012.3333%203.33333C11.9581%203.33333%2011.6117%203.45736%2011.3332%203.66667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_10'%20d='M8%203C8%202.07953%208.7462%201.33333%209.66667%201.33333C10.5871%201.33333%2011.3333%202.07953%2011.3333%203C11.3333%203.25402%2011.2765%203.49477%2011.1749%203.71022'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_11'%20d='M10.6667%2013.3333C10.6667%2014.0697%2010.0697%2014.6667%209.33333%2014.6667C8.59693%2014.6667%208%2014.0697%208%2013.3333'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_85'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const ia =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M1.33333%204H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M1.33333%206.66667H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M1.33333%209.33333H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_4'%20d='M1.33333%2012H4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_5'%20d='M12%201.33333H4C3.26362%201.33333%202.66667%201.93029%202.66667%202.66667V13.3333C2.66667%2014.0697%203.26362%2014.6667%204%2014.6667H12C12.7364%2014.6667%2013.3333%2014.0697%2013.3333%2013.3333V2.66667C13.3333%201.93029%2012.7364%201.33333%2012%201.33333Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_6'%20d='M10.6667%201.33333V14.6667'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const ca =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%3e%3cpath%20id='Vector'%20d='M10.6667%201.33333V4M5.33333%201.33333V4'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M8.66667%202.66667H7.33333C4.81917%202.66667%203.5621%202.66667%202.78105%203.44771C2%204.22877%202%205.48584%202%208V9.33333C2%2011.8475%202%2013.1046%202.78105%2013.8856C3.5621%2014.6667%204.81917%2014.6667%207.33333%2014.6667H8.66667C11.1808%2014.6667%2012.4379%2014.6667%2013.2189%2013.8856C14%2013.1046%2014%2011.8475%2014%209.33333V8C14%205.48584%2014%204.22877%2013.2189%203.44771C12.4379%202.66667%2011.1808%202.66667%208.66667%202.66667Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M2%206.66667H14'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const la =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Frame'%20clip-path='url(%23clip0_0_315)'%3e%3cpath%20id='Vector'%20d='M8%2010C9.1046%2010%2010%209.1046%2010%208C10%206.8954%209.1046%206%208%206C6.8954%206%206%206.8954%206%208C6%209.1046%206.8954%2010%208%2010Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M13.0816%206.93027L12.3498%205.1632L13.3333%204L12%202.66667L10.8431%203.6553L9.03853%202.91316L8.62353%201.33333H7.32067L6.8994%202.93409L5.13627%203.67731L4%202.66667L2.66667%204L3.63558%205.19257L2.915%206.9642L1.33333%207.33333V8.66667L2.93407%209.10367L3.67717%2010.8665L2.66667%2012L4%2013.3333L5.19411%2012.3602L6.93133%2013.0749L7.33333%2014.6667H8.66667L9.06967%2013.0755L10.8367%2012.3437C11.1313%2012.5542%2012%2013.3333%2012%2013.3333L13.3333%2012L12.3439%2010.8329L13.0759%209.06533L14.6666%208.65147L14.6667%207.33333L13.0816%206.93027Z'%20stroke='%2317324d'%20stroke-opacity='0.8'%20stroke-width='1.3'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_0_315'%3e%3crect%20width='16'%20height='16'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const da =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='search'%3e%3cpath%20id='Vector'%20d='M14%2014L11.1067%2011.1067'%20stroke='%2317324d'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M7.33333%2012.6667C10.2789%2012.6667%2012.6667%2010.2789%2012.6667%207.33333C12.6667%204.38781%2010.2789%202%207.33333%202C4.38781%202%202%204.38781%202%207.33333C2%2010.2789%204.38781%2012.6667%207.33333%2012.6667Z'%20stroke='%2317324d'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const ua =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='SVG'%3e%3cpath%20id='Vector'%20d='M1.33301%208C1.33301%205.54058%201.33301%204.31087%201.87555%203.43918C2.07627%203.11668%202.32561%202.83618%202.61228%202.61036C3.38711%202%204.48019%202%206.66634%202H9.33301C11.5191%202%2012.6122%202%2013.3871%202.61036C13.6737%202.83618%2013.9231%203.11668%2014.1238%203.43918C14.6663%204.31087%2014.6663%205.54058%2014.6663%208C14.6663%2010.4594%2014.6663%2011.6891%2014.1238%2012.5608C13.9231%2012.8833%2013.6737%2013.1638%2013.3871%2013.3897C12.6122%2014%2011.5191%2014%209.33301%2014H6.66634C4.48019%2014%203.38711%2014%202.61228%2013.3897C2.32561%2013.1638%202.07627%2012.8833%201.87555%2012.5608C1.33301%2011.6891%201.33301%2010.4594%201.33301%208Z'%20stroke='%2317324d'%20stroke-width='1.33333'/%3e%3cpath%20id='Vector_2'%20d='M6.33301%202V14'%20stroke='%2317324d'%20stroke-width='1.33333'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_3'%20d='M3.33301%204.66667H3.99967M3.33301%206.66667H3.99967'%20stroke='%2317324d'%20stroke-width='1.33333'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e";
const ga = [
  {
    key: "chat",
    labelKey: "nav.chat",
    path: "/chat",
  },
  {
    key: "gallery",
    labelKey: "nav.gallery",
    path: "/gallery",
  },
  {
    key: "vault",
    labelKey: "nav.vault",
    path: "/memory-vault",
  },
  {
    key: "calendar",
    labelKey: "nav.calendar",
    path: "/calendar",
  },
  {
    key: "more",
    labelKey: "nav.more",
    path: "/more",
  },
];
function va(pathname, path) {
  if (pathname === path) {
    return true;
  }
  if (path === "/") {
    return false;
  }
  return pathname.startsWith(`${path}/`);
}
const chat =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon'%3e%3cpath%20id='Vector'%20d='M19.25%2010.5417C19.2527%2011.6008%2019.0369%2012.6492%2018.616%2013.6211C18.1951%2014.5931%2017.5782%2015.4678%2016.8039%2016.1905C16.0296%2016.9132%2015.1145%2017.4683%2014.1158%2017.8213C13.1172%2018.1742%2012.0565%2018.3173%2011%2018.2417C9.7906%2018.2407%208.59801%2017.9583%207.51667%2017.4167L2.75%2019.25L4.49167%2014.575C3.75268%2013.4102%203.34017%2012.0683%203.29726%2010.6895C3.25436%209.3107%203.58264%207.94571%204.24778%206.73722C4.91292%205.52872%205.8905%204.5211%207.07831%203.81969C8.26612%203.11828%209.62055%202.74884%2011%202.75C12.0642%202.67368%2013.1327%202.81936%2014.1377%203.17782C15.1426%203.53627%2016.0621%204.09967%2016.8378%204.83227C17.6135%205.56488%2018.2285%206.4507%2018.6437%207.43354C19.059%208.41639%2019.2654%209.47481%2019.25%2010.5417Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%2317324D'/%3e%3c/g%3e%3c/svg%3e";
const gallery =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon'%3e%3cpath%20id='Vector'%20d='M5.5%202.75H16.5C18.0188%202.75%2019.25%203.98122%2019.25%205.5V16.5C19.25%2018.0188%2018.0188%2019.25%2016.5%2019.25H5.5C3.98122%2019.25%202.75%2018.0188%202.75%2016.5V5.5C2.75%203.98122%203.98122%202.75%205.5%202.75Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_2'%20d='M9.44167%207.79167C9.44167%208.70294%208.70294%209.44167%207.79167%209.44167C6.8804%209.44167%206.14167%208.70294%206.14167%207.79167C6.14167%206.8804%206.8804%206.14167%207.79167%206.14167C8.70294%206.14167%209.44167%206.8804%209.44167%207.79167Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_3'%20d='M19.25%2013.75L14.6667%209.16667L6.41667%2017.4167'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3c/g%3e%3c/svg%3e";
const vault =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon'%3e%3cpath%20id='Vector'%20d='M6.41667%202.75H15.5833C17.6084%202.75%2019.25%204.39162%2019.25%206.41667V15.5833C19.25%2017.6084%2017.6084%2019.25%2015.5833%2019.25H6.41667C4.39162%2019.25%202.75%2017.6084%202.75%2015.5833V6.41667C2.75%204.39162%204.39162%202.75%206.41667%202.75Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_2'%20d='M14.6667%2011C14.6667%2013.025%2013.025%2014.6667%2011%2014.6667C8.97496%2014.6667%207.33333%2013.025%207.33333%2011C7.33333%208.97496%208.97496%207.33333%2011%207.33333C13.025%207.33333%2014.6667%208.97496%2014.6667%2011Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3c/g%3e%3c/svg%3e";
const calendar =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon'%3e%3cpath%20id='Vector'%20d='M5.5%203.66667H16.5C18.0188%203.66667%2019.25%204.89788%2019.25%206.41667V17.4167C19.25%2018.9355%2018.0188%2020.1667%2016.5%2020.1667H5.5C3.98122%2020.1667%202.75%2018.9355%202.75%2017.4167V6.41667C2.75%204.89788%203.98122%203.66667%205.5%203.66667Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_2'%20d='M14.6667%201.83333V5.5M7.33333%201.83333V5.5M2.75%209.16667H19.25'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3c/g%3e%3c/svg%3e";
const more =
  "data:image/svg+xml,%3csvg%20preserveAspectRatio='none'%20overflow='visible'%20style='display:%20block;'%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='icon'%3e%3cpath%20id='Vector'%20d='M4.58333%202.75H7.33333C8.34586%202.75%209.16667%203.57081%209.16667%204.58333V7.33333C9.16667%208.34586%208.34586%209.16667%207.33333%209.16667H4.58333C3.57081%209.16667%202.75%208.34586%202.75%207.33333V4.58333C2.75%203.57081%203.57081%202.75%204.58333%202.75Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_2'%20d='M14.6667%202.75H17.4167C18.4292%202.75%2019.25%203.57081%2019.25%204.58333V7.33333C19.25%208.34586%2018.4292%209.16667%2017.4167%209.16667H14.6667C13.6541%209.16667%2012.8333%208.34586%2012.8333%207.33333V4.58333C12.8333%203.57081%2013.6541%202.75%2014.6667%202.75Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_3'%20d='M4.58333%2012.8333H7.33333C8.34586%2012.8333%209.16667%2013.6541%209.16667%2014.6667V17.4167C9.16667%2018.4292%208.34586%2019.25%207.33333%2019.25H4.58333C3.57081%2019.25%202.75%2018.4292%202.75%2017.4167V14.6667C2.75%2013.6541%203.57081%2012.8333%204.58333%2012.8333Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3cpath%20id='Vector_4'%20d='M14.6667%2012.8333H17.4167C18.4292%2012.8333%2019.25%2013.6541%2019.25%2014.6667V17.4167C19.25%2018.4292%2018.4292%2019.25%2017.4167%2019.25H14.6667C13.6541%2019.25%2012.8333%2018.4292%2012.8333%2017.4167V14.6667C12.8333%2013.6541%2013.6541%2012.8333%2014.6667%2012.8333Z'%20stroke-width='1.74167'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23526779'%20stroke-opacity='0.48'/%3e%3c/g%3e%3c/svg%3e";
const Sa = {
  chat,
  gallery,
  vault,
  calendar,
  more,
};
function KaComponent({ hidden }) {
  const { pathname } = useLocation();
  const { t: t_1 } = useI18n();
  if (hidden) {
    return null;
  }
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-6 pb-3 md:hidden"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <nav
        aria-label={t_1("nav.main")}
        className={cn(
          "flex h-[66px] w-full max-w-[342px] items-center justify-between rounded-full p-2",
          "border border-alma-hairline bg-alma-surface/95 backdrop-blur-[9px]",
          "shadow-[0px_2px_3px_0px_rgba(41,94,133,0.06),0px_10px_14px_0px_rgba(41,94,133,0.14)]",
        )}
      >
        {ga.map((r) => {
          const s = va(pathname, r.path);
          return (
            <Link
              key={r.key}
              to={r.path}
              aria-current={s ? "page" : undefined}
              className={cn(
                "flex h-[50px] items-center justify-center rounded-full transition-all",
                s
                  ? "gap-2 bg-alma-panel ps-4 pe-[18px] shadow-[0px_4px_10px_0px_rgba(41,94,133,0.22)]"
                  : "w-[50px] hover:bg-alma-panel/40",
              )}
            >
              <img src={Sa[r.key]} alt="" className={cn("size-[22px] shrink-0", !s && "opacity-70")} />
              {s && (
                <span className="whitespace-nowrap font-body text-[13px] font-medium tracking-[0.26px] text-alma-ink">
                  {t_1(r.labelKey)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
const Cr = "alma:sidebar-collapsed";
const Ra = [
  {
    labelKey: "nav.today",
    path: "/today",
    icon: ia,
  },
  {
    labelKey: "nav.newChat",
    shortLabelKey: "nav.chat",
    path: "/chat",
    icon: sa,
  },
  {
    labelKey: "nav.memories",
    path: "/memories",
    icon: aa,
  },
  {
    labelKey: "nav.calendar",
    path: "/calendar",
    icon: ca,
  },
  {
    labelKey: "nav.profile",
    path: "/profile",
    lucide: CircleUser,
  },
  {
    labelKey: "nav.settings",
    path: "/settings",
    icon: la,
  },
];
function Ma() {
  try {
    return window.localStorage.getItem(Cr) === "1";
  } catch {
    return false;
  }
}
export function AppSidebar({
  hideMobileTabs,
  conversations,
  currentConversation = null,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
} = {}) {
  const { t: t_1 } = useI18n();
  const [l, setL] = React.useState(Ma);
  const [f, setF] = React.useState(false);
  const [d, setD] = React.useState("");
  const [g, setG] = React.useState("");
  const ERef = React.useRef(null);
  const x = useNavigate();
  const j = useLocation();
  const D = useSearchPalette();
  const M = useMobileNav();
  React.useEffect(() => {
    try {
      window.localStorage.setItem(Cr, l ? "1" : "0");
    } catch {}
  }, [l]);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const data_user = data.user;
      if (data_user) {
        setG(data_user.user_metadata?.display_name || data_user.email || "You");
      }
    });
  }, []);
  const P = useQuery({
    queryKey: ["sidebar-conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("id, title, updated_at")
        .order("updated_at", {
          ascending: false,
        })
        .limit(20);
      if (error) {
        throw error;
      }
      return data ?? [];
    },
    enabled: conversations === undefined,
    staleTime: 30000,
  });
  const O = React.useMemo(() => conversations ?? P.data ?? [], [conversations, P.data]);
  const F = React.useMemo(() => filterConversations(O, d), [O, d]);
  const H = new Date();
  React.useCallback(() => {
    setL(false);
    setF(true);
    window.setTimeout(() => ERef.current?.focus(), 0);
  }, []);
  const k = React.useCallback(() => {
    setF(false);
    setD("");
  }, []);
  const R = (conversationId) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
      return;
    }
    x("/chat", {
      state: {
        conversationId,
      },
    });
  };
  const y = () => {
    if (onNewConversation) {
      onNewConversation();
      return;
    }
    x("/chat", {
      state: {
        newConversation: true,
      },
    });
  };
  const A = async () => {
    await supabase.auth.signOut();
    x("/");
  };
  const UComponent = (b) => {
    if (b.lucide) {
      const V = b.lucide;
      return <V className="h-4 w-4 shrink-0 text-[rgba(23,50,77,0.8)]" strokeWidth={1.3} />;
    }
    return <img src={b.icon} alt="" className="h-4 w-4 shrink-0" />;
  };
  const ZComponent = (b) => {
    const V = j.pathname === b.path;
    const G = (
      <>
        {UComponent(b)}
        {!l && (
          <span
            className={cn(
              "truncate font-body text-sm tracking-[0.28px]",
              V ? "text-alma-ink" : "text-[rgba(23,50,77,0.8)]",
            )}
          >
            {t_1(b.labelKey)}
          </span>
        )}
      </>
    );
    const Pe = (
      <Link
        to={b.path}
        onClick={
          b.path === "/chat"
            ? (re) => {
                re.preventDefault();
                y();
              }
            : undefined
        }
        aria-current={V ? "page" : undefined}
        className={cn(
          "flex h-[38px] items-center gap-2 rounded-[12px] px-3 transition-colors",
          l ? "justify-center" : "w-full",
          V ? "bg-alma-panel" : "hover:bg-[rgba(40,94,133,0.06)]",
        )}
      >
        {G}
      </Link>
    );
    if (l) {
      return (
        <li key={b.path}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{Pe}</TooltipTrigger>
            <TooltipContent side="right">{t_1(b.labelKey)}</TooltipContent>
          </Tooltip>
        </li>
      );
    }
    return <li key={b.path}>{Pe}</li>;
  };
  return (
    <>
      <Sheet
        open={M.isOpen}
        onOpenChange={(b) => {
          if (b) {
            return M.open();
          }
          return M.close();
        }}
      >
        <SheetContent side="left" className="flex w-[300px] flex-col gap-0 bg-alma-sidebar p-0 md:hidden">
          <SheetTitle className="px-4 pt-4 font-display text-[15px] font-semibold tracking-[0.15px] text-alma-ink">
            {t_1("nav.recents")}
          </SheetTitle>
          <div className="flex-1 overflow-y-auto p-4">
            {O.length === 0 ? (
              <p className="px-3 font-body text-[12.5px] leading-[18px] tracking-[0.25px] text-alma-faint">
                {t_1("nav.noConversations")}
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {O.map((b) => (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => {
                        R(b.id);
                        M.close();
                      }}
                      className="flex min-h-[44px] w-full items-center rounded-[12px] px-3 text-start font-body text-sm text-alma-ink transition-colors hover:bg-alma-panel"
                    >
                      <span className="truncate">{conversationTitle(b)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t border-alma-line p-4">
            <button
              type="button"
              onClick={() => {
                y();
                M.close();
              }}
              className="flex min-h-[44px] w-full items-center justify-center rounded-[12px] bg-alma-action font-body text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t_1("chat.newChat")}
            </button>
          </div>
        </SheetContent>
      </Sheet>
      <KaComponent hidden={hideMobileTabs} />
      <nav
        aria-label={t_1("nav.main")}
        className={cn(
          "hidden h-full shrink-0 flex-col bg-alma-sidebar font-body transition-[width] duration-200 md:flex",
          l ? "w-[72px]" : "w-[240px]",
        )}
      >
        <div className={cn("flex items-center justify-between px-5 pb-4 pt-[30px]", l && "flex-col gap-3 px-2")}>
          {!l && (
            <Link
              to="/"
              aria-label={t_1("nav.homeLink")}
              className="flex items-center gap-[6.72px] rounded-lg transition-opacity hover:opacity-70"
            >
              <img src={logoMark} alt="" className="h-[36.9px] w-[31.1px]" />
              <span
                className="font-brand text-[15.36px] font-bold text-alma-wordmark"
                style={{
                  fontVariationSettings: '"SOFT" 0, "WONK" 1',
                }}
              >
                ALMA AI
              </span>
            </Link>
          )}
          <div className={cn("flex items-center", l && "flex-col")}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={D.open}
                  aria-label={t_1("nav.searchEverything")}
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(40,94,133,0.1)]"
                >
                  <img src={da} alt="" className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Search everything (⌘K)</TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setL((b) => !b)}
                  aria-label={l ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!l}
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(40,94,133,0.1)]"
                >
                  <img src={ua} alt="" className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{l ? "Expand" : "Collapse"}</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <ul className={cn("flex flex-col gap-3", l ? "px-2" : "px-5")}>{Ra.map(ZComponent)}</ul>
        {!l && (
          <div className="mt-5 flex min-h-0 flex-1 flex-col px-5">
            <div className="flex items-center gap-3">
              <span className="font-body text-xs tracking-[0.36px] text-[rgba(23,50,77,0.7)]">
                {t_1("nav.recents")}
              </span>
              <span
                className="h-px flex-1"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(23,50,77,0.35) 0 1.5px, transparent 1.5px 5px)",
                }}
              />
            </div>
            {f && (
              <div className="relative mt-3">
                <input
                  ref={ERef}
                  value={d}
                  onChange={(b) => setD(b.target.value)}
                  placeholder={t_1("nav.searchHint")}
                  aria-label={t_1("nav.searchHint")}
                  className="h-9 w-full rounded-[12px] border border-[rgba(23,50,77,0.14)] bg-white/70 ps-3 pe-8 font-body text-[13px] text-[rgba(23,50,77,0.9)] outline-none transition-colors placeholder:text-[rgba(23,50,77,0.4)] focus:border-alma-accent-deep"
                />
                <button
                  type="button"
                  onClick={k}
                  aria-label={t_1("nav.closeSearch")}
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-[rgba(23,50,77,0.5)] hover:text-[rgba(23,50,77,0.9)]"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <ScrollArea className="-mx-2 mt-3 flex-1">
              <ul className="space-y-1 px-2 pb-3">
                {F.map((b) => (
                  <li key={b.id}>
                    <div
                      className={cn(
                        "group relative flex items-center rounded-[12px] transition-colors",
                        currentConversation === b.id ? "bg-alma-panel" : "hover:bg-[rgba(40,94,133,0.06)]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => R(b.id)}
                        className="flex min-w-0 flex-1 flex-col items-start gap-0.5 px-3 py-2 text-start"
                      >
                        <span className="w-full truncate font-body text-xs leading-5 tracking-[0.36px] text-[rgba(23,50,77,0.9)]">
                          {conversationTitle(b)}
                        </span>
                        <span className="font-body text-[10px] tracking-[0.3px] text-[rgba(23,50,77,0.5)]">
                          {conversationDayLabel(b.updated_at, H)}
                        </span>
                      </button>
                      {onDeleteConversation && (
                        <button
                          type="button"
                          onClick={() => onDeleteConversation(b.id)}
                          aria-label={`Delete ${conversationTitle(b)}`}
                          className="me-2 shrink-0 rounded p-1 text-[rgba(23,50,77,0.5)] opacity-0 transition-opacity hover:text-[rgba(23,50,77,0.9)] focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {F.length === 0 && (
                  <li className="px-3 py-2 font-body text-xs text-[rgba(23,50,77,0.45)]">
                    {t_1("nav.noConversations")}
                  </li>
                )}
              </ul>
            </ScrollArea>
          </div>
        )}
        {l && <div className="flex-1" />}
        <div className={cn("pb-5", l ? "px-2" : "px-5")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-[12px] p-1 transition-colors hover:bg-[rgba(40,94,133,0.08)]",
                  l ? "justify-center" : "w-full",
                )}
              >
                <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full border border-[rgba(23,50,77,0.12)] bg-white font-body text-base font-medium text-[#5765ff]">
                  {(g || "?").charAt(0).toUpperCase()}
                </span>
                {!l && <span className="truncate font-body text-base font-medium text-[rgba(23,50,77,0.8)]">{g}</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 border bg-popover z-50">
              <DropdownMenuItem onClick={() => x("/profile")} className="cursor-pointer">
                <lucide className="me-2 h-4 w-4" />
                {t_1("nav.profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={A} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="me-2 h-4 w-4" />
                {t_1("nav.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}


import { Link, NavLink } from "react-router";
import { APP_LOGO, WEBSITE_NAVIGATION } from "src/constants/variables";

  export default function Footer() {
    return (
      <footer className="bg-black/20">
        <div className="bg-black/20">
        
        <div className="mx-auto max-w-7xl px-2 sm:px-0 pt-10 sm:pt-6 pb-4">
          <div className="sm:grid sm:grid-cols-5 border-t border-white/60">
          <div className="space-y-8 col-span-2 pt-4">
            <img
              alt="AFE Partner Connections"
              src={APP_LOGO}
              className="h-9"
            />
            <p className="text-sm/6 text-center sm:text-start sm:text-balance text-white custom-style-long-text">
            Streamline your AFE Partner workflow with a single, centralized platform for all your AFE documents and details.
            </p>
          </div>
          <div className="col-span-3 ">
            <div className="grid grid-cols-3 items-start ">
            {WEBSITE_NAVIGATION.map((item) => (
              <div className=""
              key={item.id}>
              <LinkCardList
              items={item}
              ></LinkCardList>
              </div>
            ))}
            </div>
            </div>
            </div>
        
            <div className="mt-2 border-t border-white/60 pt-8 pl-0 sm:pl-0 text-center sm:text-start">
              <p className="text-sm/6 text-gray-300 custom-style-long-text">&copy; 2024 Like The Queen LLC. All rights reserved.</p>
              
              <div className="flex flex-col sm:flex-row text-center sm:text-start sm:justify-between">
                <p className="text-sm/6 text-gray-300 custom-style-long-text">For Whit & Corr - I write this code while you sleep</p>
                
              </div>
            </div>
          </div>
          </div>
      </footer>
    )
  }

  type LinkCardInterface = {
      name: string;
      href: string;
  }

  type NavSubItem = {
  id: number;
  name: string;
  href: string;
}

type NavItems = {
  id: number;
  title: string;
  subItems: NavSubItem[]
}

type LinkCardListProps = {
  items: NavItems;
}
  
  function LinkCard({ name, href }: LinkCardInterface) {
    return(
      <>
        <NavLink
          to={href}
          className="inline-flex text-sm/7 pb-1 custom-style font-light text-white/80 text-right "
          role="button">
          {name}
        </NavLink>
      </>
    )
  }

function LinkCardList({ items }: LinkCardListProps) {
  return (
    <div className="px-2 sm:px-0 py-4 flex flex-col items-center sm:items-start">
      <h3 className="text-sm/7 font-medium text-white custom-style pb-4">{items.title}</h3>
      {items.subItems.map((item) => (
        <LinkCard key={item.name} name={item.name} href={item.href} />
      ))}
    </div>
  )
}
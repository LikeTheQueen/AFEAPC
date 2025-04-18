import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
const today = new Date();
const tet = "this is a string";
const name = "John Doe";
const currentDate = new Date();
const fourDaysAgo = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000));
const navigation = [
   { name: 'How it Works', href: '#' },
   { name: 'AFE Systems', href: '#' },
   { name: 'About', href: '#' }
 ];
export default function AFEHistory() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    return <div>
      
        
      
       <p>{tet}</p>
       Today's date is: {currentDate.toLocaleDateString()}
       <p>4 days ago</p>
       Today's date is: {fourDaysAgo.toLocaleDateString()}
     
    
    </div>;
  }
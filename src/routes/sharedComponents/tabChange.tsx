import { activeTab } from "src/helpers/helpers";

type Props = {
  selected: number;
  tabs: {
    id: number,
    name: string,
    current: boolean
  }[];
  onTabChange: (currentTab: number) => void;
  onTabListChange: (tabs: any[]) => void;
};

export function handleTabChanged({selected, tabs, onTabChange, onTabListChange}: Props){
    const updateCurrentTab = activeTab(tabs, selected);
    onTabChange(updateCurrentTab.selectedTabId);
    onTabListChange(updateCurrentTab.updatedTabs);
  };
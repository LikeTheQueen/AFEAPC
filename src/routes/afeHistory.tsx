const today = new Date();
const tet = "this is a string";
const name = "John Doe";
const currentDate = new Date();
const fourDaysAgo = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000));
export default function AFEHistory() {
    return <div>
       <p>{tet}</p>
       Today's date is: {currentDate.toLocaleDateString()}
       <p>4 days ago</p>
       Today's date is: {fourDaysAgo.toLocaleDateString()}
    </div>;
  }
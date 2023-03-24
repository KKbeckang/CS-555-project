import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerProjectDashboard() {
    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
  const [project, setProjectData] = useState({
    ManagerAccepted:"",
    SaleAuthorised:"",
    Status:"",
    customer:"",
    customerName:"",
    purchased:"",
    saleAssigned:"",
    projectID:""
  });
  const [projectAccepted, setprojectAccepted] = useState(false);

  async function acceptProject(projectID) {
    
    //update user collection
    const projectRef = doc(db, "project", projectID);

        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
      ManagerAccepted: true,
      managerAssigned: auth.currentUser.uid,
      Status: "Manager Confirmed, Project will start Soon"
    });

    alert(`Project ${projectID} Accepted`);
  
  }

async function declineProject(projectID) {
    const projectRef = doc(db, "project", projectID);

    // Set the "capital" field of the city 'DC'
await updateDoc(projectRef, {
  ManagerAccepted: false,
  Status: "Declined by Manager"
});

alert(`Declined Project ${projectID} `);
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Manager Project Dashboard use effect")
      
      const docRef = doc(db, "project", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProjectData({projectID:docSnap.id,...docSnap.data()});
      }
      else console.log("No Data")
    }
    fetchProject();
  }, []);



  return (
    <div>
        <h2>Project Dashboard</h2>
        <div>     
        <ul>
            <div >
            <div>
                <li >ProjectID: {project.projectID}</li>
                <li>Customer:{project.customerName} </li>
                <li>Purchased By: {project.customer}</li>
                <li>Sale Authorised: {project.SaleAuthorised ? "True" : "False"}</li>
                <li>Project Accepted: {project.ManagerAccepted ? "True" : "False"}</li>
                <li>Status: {project.Status} </li>
                </div>
            {project.ManagerAccepted ? <h3>Project Confirmed</h3> : <h3>Accept this Project ?</h3>}
            <>
            <div>
            <button onClick={()=>acceptProject(project.projectID)} disabled={project.ManagerAccepted}>Accept</button>
              <button onClick={()=>declineProject(project.projectID)} disabled={project.Status === "Declined by Manager"}>Decline</button>
            </div>
            </>
             
            <br/>
            </div>
        </ul>
      </div>
      <SalesManagerMessaging data={{projectData: project,auth: auth}}/>
      </div>
  );
}

export default ManagerProjectDashboard;
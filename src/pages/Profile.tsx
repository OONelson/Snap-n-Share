import * as React from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../components/ui/card";
import SideBar from "@/layout/SideBar";
import { useUsername } from "@/contexts/UsernameContext";
import { useUserProfilePhoto } from "@/contexts/UserProfilePhoto";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { DocumentResponse, Post, PhotoMeta } from "@/types";
import { getPostByUserId } from "@/repository/post.service";

interface IProfileProps {}

type Tab = "Tab1" | "Tab2" ;

const Profile: React.FunctionComponent<IProfileProps> = () => {
  const { username } = useUsername();
  const { capturedImage } = useUserProfilePhoto();
  const { logOut, user } = useUserAuth();

  const [data, setData] = React.useState<DocumentResponse[]>([]);
  const [activeTab, setActiveTab] = React.useState<Tab>("Tab1");

  const handleChangeTab = (tab: Tab) => {
    setActiveTab(tab);
  };


  const getAllPosts = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
      const tempArr: DocumentResponse[] = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Post;
          const responseObj: DocumentResponse = {
            id: doc.id,
            ...data,
          };
          console.log(responseObj);
          tempArr.push(responseObj);
        });

        setData(tempArr);
      } else {
        console.log("no such document");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (user != null) {
      getAllPosts(user.uid);
    }
  }, []);

	const renderPosts=()=>{
		return data.map((item)=>{
			return(
				<div key={item.photos[0].uuid}>
					<img src={`${item.photos[0].cdnUrl}/-/progressive/yes/-scale/300x300/center/`}/>
				</div>
			)
		})
	}
  // const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
  // null
  // );

  // useEffect(() => {
  // 	const fetchProfilePicture = async () => {
  // 		const userImageDocRef = doc(db, "profilephoto", userID);
  // 		const docSnapshot = await getDoc(userImageDocRef);

  // 		if (docSnapshot.exists()) {
  // 			const userData = docSnapshot.data();
  // 			if (userData) {
  // 				setProfilePictureUrl(userData);
  // 			}
  // 		}
  // 	};
  // });

  return (
    <main className="flex h-full">
      <SideBar />
      <Card className="flex flex-col sm:w-5/6 w-full px-2 border-none md:w-full">
        {/* <CardHeader>
					<CardTitle>

					</CardTitle>
				</CardHeader> */}
        <div className="flex justify-end items-center pt-2 md:pb-10">
          <Button className="h-8 w-20 sm:h-12 " onClick={logOut}>
            {" "}
            logout
          </Button>
        </div>
        <CardContent className="p-0 pt-10">
          <section className="flex flex-row justify-center items-center w-full sm:w-4/5">
            <div className="flex flex-col item-center justify-between">
              <div className="flex items-center justify-center sm:w-80 w-auto">
                <picture className="">
                  <img
                    src={capturedImage}
                    alt="profilephoto"
                    className="sm:h-32 sm:w-32 h-34 w-34 rounded-full"
                  />
                </picture>
                <div className="flex justify-between items-center w-full">
                  <CardTitle>{username}</CardTitle>
                  <p className="text-lg font-normal">
                    <span>0</span>
                    Posts
                  </p>
                  <Button className="h-8 w-24 sm:h-12 ">Edit profile</Button>
                </div>
              </div>

              <div>
                <CardDescription>
                  <h2>NAme</h2>
                  <p>bio</p>
                </CardDescription>
              </div>
            </div>
          </section>
          <section className="flex mt-20">
            <div>
              <h2 onClick={() => handleChangeTab("Tab1")}>Posts</h2>
              <h2 onClick={() => handleChangeTab("Tab2")}>Bookmarks</h2>
            </div>
            <div>
              {activeTab === "Tab1" && <div>
								{data ? renderPosts() : <p>No posts yet</p>}
								</div>}

              {activeTab === "Tab1" && <div>Bookmark</div>}
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
};

export default Profile;

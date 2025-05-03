import tstImg from "../../../Assets/grp.jpg"

const MemberBox = ({member, showMemberboxMenu}) => {
    return ( 
        <div className="member-box" onContextMenu={e=>showMemberboxMenu(e, member)}>
            <div className="profile-image">
                <img src={tstImg} />
            </div>
            <div className="text">
                <div className="name">{member.name}</div>
                <div className="position">{member.position}</div>
            </div>
        </div>
     );
}
 
export default MemberBox;
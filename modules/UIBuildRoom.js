import { RoomTree, direction } from "./RoomTree.js";
import {DungeonRooms} from "./DungeonLayout.js"
import {DungeonRoom} from "./DungeonRoom.js"
import {MapTile} from "./MapTile.js"
import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"

function UIBuildRoom(quantizedWorldCoords, roomTree)
{
	//array safety checks
	//console.log(quantizedWorldCoords);
	if(quantizedWorldCoords.x >= DungeonRooms.length)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.x + 
		" of DungeonRooms, which has xdimensions " + DungeonRooms.length);
		return;
	}
	if(quantizedWorldCoords.x < 0)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.x + 
		" of DungeonRooms, which has xdimensions " + DungeonRooms.length);
		return;
	}
	if(quantizedWorldCoords.y >= DungeonRooms[quantizedWorldCoords.x].length)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.y + 
		" of DungeonRooms, which has ydimensions " + DungeonRooms[quantizedWorldCoords.x].length);
		return;
	}
	if(quantizedWorldCoords.y < 0)
	{
		console.log("Error: attempted to index " + quantizedWorldCoords.y + 
		" of DungeonRooms, which has ydimensions " + DungeonRooms[quantizedWorldCoords.x].length);
		return;
	}
	//console.log("success");
	
	const chosenRoom = DungeonRooms[quantizedWorldCoords.x][quantizedWorldCoords.y];
	
	if(!CanBuild(chosenRoom))
	{
		//play sfx for build failure here
		return;
	}
	chosenRoom.CreateMapTiles();
    nodeBuild(quantizedWorldCoords.x, quantizedWorldCoords.y, roomTree);
}

function nodeBuild(x, y, roomTree) {
    if (roomTree.dungeonToNode(x - 1, y) != null) {
        const node = roomTree.dungeonToNode(x - 1, y);
        node.addRoom(roomTree.getGrid(), direction.right, roomTree.nodeToDungeon(node));
    } else if (roomTree.dungeonToNode(x + 1, y) != null) {
        const node = roomTree.dungeonToNode(x + 1, y);
        node.addRoom(roomTree.getGrid(), direction.left, roomTree.nodeToDungeon(node));
    } else if (roomTree.dungeonToNode(x, y - 1) != null) {
        const node = roomTree.dungeonToNode(x, y - 1);
        node.addRoom(roomTree.getGrid(), direction.up, roomTree.nodeToDungeon(node));
    } else if (roomTree.dungeonToNode(x, y + 1) != null) {
        const node = roomTree.dungeonToNode(x, y + 1);
        node.addRoom(roomTree.getGrid(), direction.down, roomTree.nodeToDungeon(node));
    } else {
        console.error("x and y coordinates given does not have a neighbouring node.");
        return null;
    }
}

function CanBuild(tryRoom)
{
	if(tryRoom.isBuilt)
	{
		//todo: build failure
		console.log("NOTICE: There is already a room there.");
		return false;
	}
	
	//check if adjacent rooms exist to connect to
	
	//NORTH
	if(tryRoom.myDungeonIndex.y < DungeonRooms[tryRoom.myDungeonIndex.x].length - 1)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x][tryRoom.myDungeonIndex.y + 1];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}
	
	//SOUTH
	if(tryRoom.myDungeonIndex.y > 0)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x][tryRoom.myDungeonIndex.y - 1];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}
	
	//EAST
	if(tryRoom.myDungeonIndex.x < DungeonRooms.length - 1)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x + 1][tryRoom.myDungeonIndex.y];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}

	//WEST
	if(tryRoom.myDungeonIndex.x > 0)
	{
		const adjRoom = DungeonRooms[tryRoom.myDungeonIndex.x - 1][tryRoom.myDungeonIndex.y];
		if(adjRoom.isBuilt)
		{
			return true;
		}
	}

	
	//couldn't find an adjacent room so we can't build here
	console.log("NOTICE: Could not find an adjacent room to connect to.");
	return false;
}

export {UIBuildRoom};

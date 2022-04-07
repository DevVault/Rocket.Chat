import { isOmnichannelRoom } from '../../../../definition/IRoom';
import { callbacks } from '../../../../lib/callbacks';
import { LivechatInquiry } from '../../../models/server/raw';
import { settings } from '../../../settings/server';
import { RoutingManager } from '../lib/RoutingManager';

callbacks.add(
	'afterSaveMessage',
	async (message, room) => {
		if (!isOmnichannelRoom(room)) {
			return message;
		}

		// skip callback if message was edited
		if ((message as any).editedAt) {
			return message;
		}

		if (!RoutingManager.getConfig().showQueue) {
			// since last message is only getting used on UI as preview message when queue is enabled
			return message;
		}

		if (!settings.get('Store_Last_Message')) {
			return message;
		}

		await LivechatInquiry.setLastMessageByRoomId(room._id, message);

		return message;
	},
	callbacks.priority.HIGH,
	'save-last-message-to-inquiry',
);
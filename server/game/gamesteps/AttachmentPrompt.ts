import { UiPrompt } from './UiPrompt.js';
import { attach } from '../GameActions/GameActions.js';
import { AbilityContext } from '../AbilityContext.js';
import { Players } from '../Constants.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type DrawCard from '../DrawCard.js';

class AttachmentPrompt extends UiPrompt {
    player: Player;
    attachmentCard: DrawCard;
    playingType: string;

    constructor(game: Game, player: Player, attachmentCard: DrawCard, playingType: string) {
        super(game);
        this.player = player;
        this.attachmentCard = attachmentCard;
        this.playingType = playingType;
    }

    continue(): boolean {
        this.game.promptForSelect(this.player, {
            source: 'Play Attachment',
            activePromptTitle: 'Select target for attachment',
            controller: Players.Self,
            gameAction: attach({ attachment: this.attachmentCard }),
            onSelect: (player: Player, card: DrawCard) => {
                attach({ attachment: this.attachmentCard }).resolve(card, new AbilityContext({ game: this.game, player: this.player, source: card }));
                return true;
            }
        });
        return true;
    }
}

export default AttachmentPrompt;

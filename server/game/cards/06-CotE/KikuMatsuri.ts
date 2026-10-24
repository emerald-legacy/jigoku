import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import type Player from '../../Player.js';

export default class KikuMatsuri extends ProvinceCard {
    static id = 'kiku-matsuri';

    override setupCardAbilities() {
        // "each player": a player with no participating character gets no target
        this.action('Honor a participating character from each side')
            .skippableTarget({
                name: 'myCharacter',
                cardType: CardType.Character,
                controller: Players.Self,
                skipIf: (context) => !this.controlsParticipant(context.player),
                cardCondition: (card) => card.isParticipating()
            }, honor())
            .skippableTarget({
                name: 'oppCharacter',
                cardType: CardType.Character,
                controller: Players.Opponent,
                skipIf: (context) => !this.controlsParticipant(context.player.opponent),
                cardCondition: (card) => card.isParticipating()
            }, honor())
            .chatText((context) => msg`honor ${[context.targets.myCharacter, context.targets.oppCharacter].flat()}`);
    }

    private controlsParticipant(player: Player | undefined) {
        return !!player?.anyCardsInPlay((card) => card.isParticipating());
    }
}

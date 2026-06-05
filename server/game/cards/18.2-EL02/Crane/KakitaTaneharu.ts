import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type Player from '../../../Player.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location, Players, PlayType } from '../../../Constants.js';

class KakitaTaneharu extends DrawCard {
    static id = 'kakita-taneharu';

    setupCardAbilities() {
        this.action({
            title: 'Search your conflict deck',
            condition: context => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 4,
                reveal: false,
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                message: '{0} puts a card underneath {1}',
                messageArgs: context => {
                    return [context.player, context.source];
                },
                gameAction: AbilityDsl.actions.placeCardUnderneath({
                    destination: this
                })
            })
        });

        this.persistentEffect({
            location: Location.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card: BaseCard) => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay((player: Player) => {
                    return player === this.controller;
                }, PlayType.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }
}


export default KakitaTaneharu;

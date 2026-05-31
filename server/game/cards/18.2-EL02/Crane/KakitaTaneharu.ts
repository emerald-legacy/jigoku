import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Locations, Players, PlayTypes } from '../../../Constants.js';

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
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card: any) => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay((player: any) => {
                    return player === this.controller;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }
}


export default KakitaTaneharu;

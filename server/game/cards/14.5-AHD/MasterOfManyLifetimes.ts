import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players, Locations } from '../../Constants.js';

class MasterOfManyLifetimes extends DrawCard {
    static id = 'master-of-many-lifetimes';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Return a character and attachments',
            when: {
                onCardLeavesPlay: (event, context) => {
                    return (
                        event.card.controller === context.player &&
                        event.card.type === CardTypes.Character &&
                        event.card.location === Locations.PlayArea
                    );
                }
            },
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: (card) => card.facedown
            },
            gameAction: AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.returnToHand((context) => ({
                        target: context.event.card.attachments
                    })),
                    AbilityDsl.actions.putIntoProvince({
                        target: context.event.card,
                        canBeStronghold: true,
                        destination: context.target.location
                    })
                ])
            })),
            effect: 'prevent {1} from leaving play, putting it into {2} instead',
            effectArgs: (context) => [context.event.card, (context.target as DrawCard).location]
        });
    }
}


export default MasterOfManyLifetimes;

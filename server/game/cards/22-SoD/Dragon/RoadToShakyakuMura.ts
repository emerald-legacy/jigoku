import type { AbilityContext } from '../../../AbilityContext';
import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { Cost } from '../../../Costs';

function captureLocationCost(): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext) {
            context.costs.captureLocationCost = context.source.location;
        },
        pay() { }
    };
}

export default class RoadToShakyakuMura extends DrawCard {
    static id = 'road-to-shakyaku-mura';


    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Return a character and attachments',
            cost: [captureLocationCost(), AbilityDsl.costs.sacrificeSelf()],
            when: {
                onCardLeavesPlay: (event, context) => {
                    return (
                        event.card.controller === context.player &&
                        event.card.type === CardTypes.Character &&
                        !event.card.isUnique() &&
                        event.card.location === Locations.PlayArea
                    );
                }
            },
            gameAction: AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.returnToHand(() => ({
                        // @ts-expect-error -- event.card.attachments is dynamically typed from the onCardLeavesPlay event
                        target: context.event.card.attachments
                    })),
                    AbilityDsl.actions.putIntoProvince({
                        // @ts-expect-error -- event.card is dynamically typed from the onCardLeavesPlay event
                        target: context.event.card,
                        canBeStronghold: true,
                        destination: context.costs.captureLocationCost
                    })
                ])
            })),
            effect: 'prevent {1} from leaving play, putting it into {2} instead',
            effectArgs: (context) => [context.event.card, context.costs.captureLocationCost]
        });
    }
}

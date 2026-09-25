import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { Cost } from '../../../costs/Cost.js';

function captureLocationCost(): Cost<{ captureLocationCost: Location }> {
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
        this.wouldInterrupt('Return a character and attachments')
            .when({
                onCardLeavesPlay: (event, context) => {
                    return (
                        event.card.controller === context.player &&
                        event.card.type === CardType.Character &&
                        !event.card.isUnique() &&
                        event.card.location === Location.PlayArea
                    );
                }
            })
            .cost(captureLocationCost())
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.returnToHand(() => ({
                        target: context.event.card?.attachments ?? []
                    })),
                    AbilityDsl.actions.putIntoProvince({
                        target: context.event.card,
                        canBeStronghold: true,
                        destination: context.costs.captureLocationCost
                    })
                ])
            })))
            .effect('prevent {1} from leaving play, putting it into {2} instead', (context) => [
                context.event.card ?? '',
                context.costs.captureLocationCost ?? ''
            ]);
    }
}

import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { multiple, putIntoProvince, returnToHand } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { captureCost } from '../../captureCost.js';

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
            .cost(captureCost('captureLocationCost', (context) => context.source.location))
            .cost(AbilityDsl.costs.sacrificeSelf())
            .cancel((context) => ({
                replacementGameAction: multiple([
                    returnToHand(() => ({
                        target: context.event.card?.attachments ?? []
                    })),
                    putIntoProvince({
                        target: context.event.card,
                        destination: context.costs.captureLocationCost
                    })
                ])
            }))
            .effect('prevent {1} from leaving play, putting it into {2} instead', (context) => [
                context.event.card ?? '',
                context.costs.captureLocationCost ?? ''
            ]);
    }
}

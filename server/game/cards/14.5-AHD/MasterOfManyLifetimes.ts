import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players, Location } from '../../Constants.js';

class MasterOfManyLifetimes extends DrawCard {
    static id = 'master-of-many-lifetimes';

    setupCardAbilities() {
        this.wouldInterrupt<DrawCard>({
            title: 'Return a character and attachments',
            when: {
                onCardLeavesPlay: (event, context) => {
                    return (
                        event.card.controller === context.player &&
                        event.card.type === CardType.Character &&
                        event.card.location === Location.PlayArea
                    );
                }
            },
            target: {
                cardType: CardType.Province,
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: (card) => card.facedown
            },
            gameAction: AbilityDsl.actions.cancel((context: TriggeredAbilityContext<DrawCard, DrawCard>) => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.returnToHand((context) => ({
                        target: context.event.card.attachments
                    })),
                    AbilityDsl.actions.putIntoProvince({
                        target: context.event.card,
                        canBeStronghold: true,
                        destination: context.target?.location
                    })
                ])
            })),
            effect: 'prevent {1} from leaving play, putting it into {2} instead',
            effectArgs: (context) => [context.event.card ?? '', context.target?.location ?? '']
        });
    }
}


export default MasterOfManyLifetimes;

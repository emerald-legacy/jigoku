import { EventName, Players, Duration, Location } from '../../../Constants.js';
import { addTrait, setBaseMilitarySkill, setBasePoliticalSkill } from '../../../effects.js';
import { cardLastingEffect, handler, putIntoPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type BaseCard from '../../../BaseCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class ShosuroIsa extends DrawCard {
    static id = 'shosuro-isa';

    private shadows: BaseCard[] = [];

    setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnCardLeavesPlay]);

        this.action('Manifest a shadow')
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => !card.isUnique()
            }, putIntoPlay())
            .effect('manifest a shadow of {0}')
            .afterwardsIf((context) => context.target.location === Location.PlayArea)
            .gameAction(
                cardLastingEffect((context) => ({
                    target: context.target,
                    duration: Duration.Custom,
                    until: {
                        onCardLeavesPlay: (event) => event.card === context.target
                    },
                    effect: [setBaseMilitarySkill(0), setBasePoliticalSkill(0), addTrait('shadow')]
                })),
                handler({
                    handler: (context) => {
                        this.shadows.push(context.target);
                    }
                })
            );
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(
            this.shadows.includes(event.card) &&
            event.card.location !== Location.RemovedFromGame
        ) {
            this.shadows = this.shadows.filter(a => a !== event.card);
            this.game.addMessage(
                '{0} fades into nothingness and is removed from the game due to leaving play',
                event.card
            );
            event.card.owner.moveCard(event.card, Location.RemovedFromGame);
        }
    }
}

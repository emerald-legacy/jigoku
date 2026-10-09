import { msg } from '../../../GameChat.js';
import { EventName, Location, Phase } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { putIntoPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

const MAXIMUM_RESSURRECTIONS = 1;

export default class RelentlessGloryseeker extends DrawCard {
    static id = 'relentless-gloryseeker';

    private ressurrectionsThisRound = 0;

    public setupCardAbilities() {
        new EventRegistrar(this.game).register({
            [EventName.OnRoundEnded]: () => this.onRoundEnded(),
            [EventName.OnCardLeavesPlay]: (event) => this.onCardLeavesPlay(event)
        });

        this.reaction('Put this character into play')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source &&
                    context.game.currentPhase === Phase.Conflict &&
                    this.ressurrectionsThisRound < MAXIMUM_RESSURRECTIONS
            })
            .gameAction(putIntoPlay())
            .chatText('return to play - {0} is ready for more')
            .location(Location.DynastyDiscardPile)
            .onResolve(() => {
                this.ressurrectionsThisRound++;
            });
    }

    public onRoundEnded() {
        this.ressurrectionsThisRound = 0;
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(
            event.card === this &&
            this.location !== Location.RemovedFromGame &&
            this.ressurrectionsThisRound >= MAXIMUM_RESSURRECTIONS
        ) {
            this.game.addMessage(msg`${this} is removed from the game due to leaving play - may their tales lead them to Yomi`);
            this.owner.moveCard(this, Location.RemovedFromGame);
        }
    }
}

import { msg } from '../../GameChat.js';
import { Blocker, CardType, EventName, Location, Players, PlayType } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { playCard } from '../../GameActions/GameActions.js';

export default class BackAlleyHideaway extends DrawCard {
    static id = 'back-alley-hideaway';

    override setupCardAbilities() {
        // the client lists the hidden characters in a popup
        this.showPopup = true;
        new EventRegistrar(this.game).register({
            [EventName.OnCardMoved]: (event) => {
                if(event.card && event.originalLocation === Location.Underneath && this.attachments.some((attachment) => attachment === event.card)) {
                    this.release(event.card);
                }
            }
        });

        this.interrupt('Place character in Hideaway')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card.isFaction('scorpion') &&
                    event.card.type === CardType.Character &&
                    event.card.controller === context.player &&
                    event.card.location === Location.PlayArea &&
                    (event.destination === Location.DynastyDiscardPile || event.destination === Location.ConflictDiscardPile)
            })
            .handler((context) => context.event.replaceHandler(() => this.hide(context.event.card)))
            .chatText((context) => msg`move ${context.event.card} into hiding`);

        // "as if it were in this province": played from a province in the dynasty phase, or using Disguised in the conflict phase
        this.action('Play a character from hiding')
            .target({
                cardType: CardType.Character,
                location: Location.Any,
                controller: Players.Self,
                cardCondition: (card) => card.isUnderneath(this)
            }, playCard({ playType: PlayType.PlayFromProvince, ignoredBlockers: [Blocker.Facedown], source: this }))
            .chatText('play {0} from hiding')
            .thenIf((context) => !context.target.isUnderneath(this))
            .sacrifice({ target: this });
    }

    /** Attached facedown; clicking it (in the popup) uses the Action. */
    private hide(card: DrawCard): void {
        card.controller.removeCardFromPile(card);
        card.leavesPlay();
        card.host = this;
        card.moveTo(Location.Underneath);
        this.attachments.push(card);
        card.parent = this;
        card.abilities.playActions.push(...this.abilities.actions);
    }

    private release(card: BaseCard): void {
        this.attachments = this.attachments.filter((attachment) => attachment !== card);
        card.parent = null;
        card.abilities.playActions = card.abilities.playActions.filter((action) => !this.abilities.actions.some((own) => own === action));
    }

    /** The hidden characters go to their discard pile with it. */
    override leavesPlay(destination?: string): void {
        for(const card of this.game.allCards.filter((card) => card.isUnderneath(this))) {
            card.owner.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
        }
        super.leavesPlay(destination);
    }
}

import type { AbilityContext } from '../../AbilityContext.js';
import { Location, Phases, PlayType, EventName, CardType } from '../../Constants.js';
import { putIntoPlay, sacrifice } from '../../GameActions/GameActions.js';
import ThenAbility from '../../ThenAbility.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import DynastyCardAction from '../../DynastyCardAction.js';
import type BaseCard from '../../BaseCard.js';
import type { Event } from '../../Events/Event.js';
import type { AbilityLimit } from '../../AbilityLimit.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

const backAlleyPersistentEffect = {
    apply: (card: BackAlleyHideaway) => {
        card.showPopup = true;
        card.popupMenuText = 'Use Interrupt ability';
        card.backAlleyActionLimit.registerEvents(card.game);
    },
    unapply: (card: BackAlleyHideaway) => {
        for(const character of card.attachments as DrawCard[]) {
            character.owner.moveCard(
                character,
                character.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
            );
            character.abilities.playActions = character.abilities.playActions.filter(
                (action) => action.title !== 'Play this character from Back-Alley Hideaway'
            );
        }

        card.showPopup = false;
        card.popupMenuText = '';
        card.backAlleyActionLimit.reset();
        card.backAlleyActionLimit.unregisterEvents(card.game);
    }
};

class BackAlleyPlayCharacterAction extends DynastyCardAction {
    title = 'Play this character from Back-Alley Hideaway';
    limit: AbilityLimit;

    constructor(
        public backAlleyCard: BackAlleyHideaway,
        card: BaseCard
    ) {
        super(card);
        this.limit = backAlleyCard.backAlleyActionLimit;
    }

    meetsRequirements(context = this.createContext()) {
        if(context.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        }
        if(context.source.location !== this.backAlleyCard.uuid) {
            return 'location';
        }
        if(
            !(context.source as DrawCard).canPlay(context, PlayType.PlayFromProvince) ||
            !((context.source as DrawCard).parent as DrawCard).canTriggerAbilities(context)
        ) {
            return 'cannotTrigger';
        }
        if(!this.canPayCosts(context)) {
            return 'cost';
        }
        return '';
    }

    executeHandler(context: AbilityContext & { chooseFate: number }) {
        context.game.addMessage(
            '{0} plays {1} from {2} with {3} additional fate',
            context.player,
            context.source,
            (context.source as DrawCard).parent,
            context.chooseFate
        );
        context.source.abilities.playActions = context.source.abilities.playActions.filter(
            (action) => action.title !== 'Play this character from Back-Alley Hideaway'
        );
        // remove associations between this card and Back-Alley Hideaway
        this.backAlleyCard.removeAttachment(context.source as DrawCard);
        (context.source as DrawCard).parent = null;
        let putIntoPlayEvent = putIntoPlay({ fate: context.chooseFate }).getEvent(context.source, context);
        let cardPlayedEvent = context.game.getEvent(EventName.OnCardPlayed, {
            player: context.player,
            card: context.source,
            originalLocation: this.backAlleyCard.uuid,
            playType: PlayType.PlayFromProvince
        });
        let window = context.game.openEventWindow([putIntoPlayEvent, cardPlayedEvent]);
        context.events = [putIntoPlayEvent];
        let thenAbility = new ThenAbility(this.backAlleyCard, {
            gameAction: sacrifice({ target: this.backAlleyCard })
        });
        window.addThenAbility(thenAbility, context);
    }

    isCardAbility() {
        return true;
    }
}

export default class BackAlleyHideaway extends DrawCard {
    static id = 'back-alley-hideaway';

    backAlleyActionLimit!: ReturnType<typeof AbilityDsl.limit.perRound>;

    setupCardAbilities() {
        this.backAlleyActionLimit = AbilityDsl.limit.perRound(1);
        this.persistentEffect({
            effect: AbilityDsl.effects.customDetachedCard(backAlleyPersistentEffect)
        });
        this.interrupt({
            title: 'Place character in Hideaway',
            when: {
                onCardLeavesPlay: (event, context: TriggeredAbilityContext) =>
                    event.card.isFaction('scorpion') &&
                    event.card.type === CardType.Character &&
                    event.card.controller === context.player &&
                    event.card.location === Location.PlayArea
            },
            effect: 'move {1} into hiding',
            effectArgs: (context: TriggeredAbilityContext) => context?.event.card ?? '',
            handler: (context: TriggeredAbilityContext) => {
                context.event.replaceHandler((event: Event) => {
                    const card = (event as Event & { card: DrawCard }).card;
                    context.player.removeCardFromPile(card);
                    card.leavesPlay();
                    card.moveTo(context.source.uuid as Location);
                    (context.source as BackAlleyHideaway).attachments.push(card);
                    card.parent = context.source as DrawCard;
                    card.abilities.playActions.push(new BackAlleyPlayCharacterAction(context.source as BackAlleyHideaway, card));
                });
            }
        });
    }
}

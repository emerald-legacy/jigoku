import type { AbilityContext } from '../../AbilityContext.js';
import { Location, Phases, PlayType, EventName, CardType } from '../../Constants.js';
import { putIntoPlay, sacrifice } from '../../GameActions/GameActions.js';
import ThenAbility from '../../ThenAbility.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import DynastyCardAction from '../../DynastyCardAction.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

const backAlleyPersistentEffect = {
    apply: (card: any) => {
        card.showPopup = true;
        card.popupMenuText = 'Use Interrupt ability';
        card.backAlleyActionLimit.registerEvents(card.game);
    },
    unapply: (card: any) => {
        for(const character of card.attachments) {
            character.owner.moveCard(
                character,
                character.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile
            );
            character.abilities.playActions = character.abilities.playActions.filter(
                (action: any) => action.title !== 'Play this character from Back-Alley Hideaway'
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
    limit: any;

    constructor(
        public backAlleyCard: BackAlleyHideaway,
        card: any
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
            !context.source.canPlay(context, PlayType.PlayFromProvince) ||
            !context.source.parent.canTriggerAbilities(context)
        ) {
            return 'cannotTrigger';
        }
        if(!this.canPayCosts(context)) {
            return 'cost';
        }
        return '';
    }

    executeHandler(context: AbilityContext) {
        context.game.addMessage(
            '{0} plays {1} from {2} with {3} additional fate',
            context.player,
            context.source,
            context.source.parent,
            (context as any).chooseFate
        );
        context.source.abilities.playActions = context.source.abilities.playActions.filter(
            (action: any) => action.title !== 'Play this character from Back-Alley Hideaway'
        );
        // remove associations between this card and Back-Alley Hideaway
        this.backAlleyCard.removeAttachment(context.source);
        context.source.parent = null;
        let putIntoPlayEvent = putIntoPlay({ fate: (context as any).chooseFate }).getEvent(context.source, context);
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
                onCardLeavesPlay: (event: any, context: TriggeredAbilityContext) =>
                    event.card.isFaction('scorpion') &&
                    event.card.type === CardType.Character &&
                    event.card.controller === context.player &&
                    event.card.location === Location.PlayArea
            },
            effect: 'move {1} into hiding',
            effectArgs: (context: TriggeredAbilityContext) => context?.event.card ?? '',
            handler: (context: TriggeredAbilityContext) => {
                context.event.replaceHandler((event: any) => {
                    context.player.removeCardFromPile(event.card);
                    event.card.leavesPlay();
                    event.card.moveTo(context.source.uuid);
                    (context.source as any).attachments.push(event.card);
                    event.card.parent = context.source;
                    event.card.abilities.playActions.push(new BackAlleyPlayCharacterAction(context.source as BackAlleyHideaway, event.card));
                });
            }
        });
    }
}

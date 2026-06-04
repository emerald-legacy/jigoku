import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, EventName, Location, Players, PlayType } from '../../../Constants.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import { ReduceableFateCost } from '../../../costs/ReduceableFateCost.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import Player from '../../../Player.js';
import type { Event } from '../../../Events/Event.js';

class HifumiCost extends ReduceableFateCost {
    isPlayCost = false;
    isPrintedFateCost = false;

    #timesTriggered = new WeakMap<Player, number>();

    refreshHifumiCount(): void {
        this.#timesTriggered = new WeakMap();
    }

    currentCost(player: Player): number {
        return this.#timesTriggered.get(player) ?? 0;
    }

    canPay(context: AbilityContext): boolean {
        const cost = this.currentCost(context.player);
        if(cost === 0) {
            return true;
        }

        let totalFateAvailable = 0;
        for(const card of this.#cardsThatCanPayForHifumi(context)) {
            totalFateAvailable += card.fate;
            if(totalFateAvailable >= cost) {
                return true;
            }
        }

        return false;
    }

    protected getReducedCost(context: AbilityContext): number {
        return this.currentCost(context.player);
    }

    protected getAlternateFatePools(context: AbilityContext): Set<DrawCard> {
        return this.#cardsThatCanPayForHifumi(context);
    }

    protected afterPayHook(event: Event): void {
        const player = (event.context as AbilityContext).player;
        this.#timesTriggered.set(player, this.currentCost(player) + 1);
    }

    #cardsThatCanPayForHifumi(context: AbilityContext): Set<DrawCard> {
        return new Set(
            context.player.cardsInPlay.filter((c: DrawCard) => c.type === CardType.Character && c.getFate() > 0)
        );
    }
}

export default class IsawaHifumi extends DrawCard {
    static id = 'isawa-hifumi';
    private eventRegistrar?: EventRegistrar;

    hifumiCost!: HifumiCost;

    setupCardAbilities() {
        this.hifumiCost = new HifumiCost(false);
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnRoundEnded, EventName.OnCardLeavesPlay]);

        this.action({
            title: 'Play an event from discard',
            cost: this.hifumiCost,
            cannotTargetFirst: true,
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an event',
                cardType: CardType.Event,
                controller: Players.Self,
                location: Location.ConflictDiscardPile,
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayType.PlayFromHand,
                    postHandler: (eventContext) => {
                        const card = eventContext.source;
                        context.game.addMessage('{0} is removed from the game by {1}\'s ability', card, context.source);
                        context.player.moveCard(card, Location.RemovedFromGame);
                    }
                })
            })),
            effect: 'play an event from their discard pile (the next time it is used this round will cost {1} fate from {2} characters)',
            effectArgs: (context) => [this.hifumiCost.currentCost(context.player), context.player],
            limit: AbilityDsl.limit.unlimited()
        });
    }

    public onRoundEnded() {
        this.hifumiCost.refreshHifumiCount();
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(event.card === this) {
            this.hifumiCost.refreshHifumiCount();
        }
    }
}

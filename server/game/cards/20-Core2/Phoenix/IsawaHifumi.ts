import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { unlimited } from '../../../AbilityLimit.js';
import { playCard } from '../../../GameActions/GameActions.js';
import { CardType, EventName, Location, Players, PlayType } from '../../../Constants.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import { ReduceableFateCost } from '../../../costs/ReduceableFateCost.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type Player from '../../../Player.js';
import type { Event } from '../../../Events/Event.js';

class HifumiCost extends ReduceableFateCost {
    override isPlayCost = false;
    override isPrintedFateCost = false;

    private timesTriggered = new WeakMap<Player, number>();

    refreshHifumiCount(): void {
        this.timesTriggered = new WeakMap();
    }

    currentCost(player: Player): number {
        return this.timesTriggered.get(player) ?? 0;
    }

    override canPay(context: AbilityContext): boolean {
        const cost = this.currentCost(context.player);
        if(cost === 0) {
            return true;
        }

        let totalFateAvailable = 0;
        for(const card of this.cardsThatCanPayForHifumi(context)) {
            totalFateAvailable += card.fate;
            if(totalFateAvailable >= cost) {
                return true;
            }
        }

        return false;
    }

    // "remove an amount of fate from (friendly) characters": never from the fate pool
    protected override isCharacterFateOnly(): boolean {
        return true;
    }

    public override getReducedCost(context: AbilityContext): number {
        return this.currentCost(context.player);
    }

    protected override getAlternateFatePools(context: AbilityContext): Set<DrawCard> {
        return this.cardsThatCanPayForHifumi(context);
    }

    protected override afterPayHook(event: Event): void {
        const player = event.context?.player;
        if(!player) {
            return;
        }
        this.timesTriggered.set(player, this.currentCost(player) + 1);
    }

    private cardsThatCanPayForHifumi(context: AbilityContext): Set<DrawCard> {
        return new Set(
            context.player.cardsInPlay.filter((c) => c.type === CardType.Character && c.getFate() > 0)
        );
    }
}

export default class IsawaHifumi extends DrawCard {
    static id = 'isawa-hifumi';

    private hifumiCost?: HifumiCost;

    override setupCardAbilities() {
        const hifumiCost = new HifumiCost(false);
        this.hifumiCost = hifumiCost;
        new EventRegistrar(this.game).register({
            [EventName.OnRoundEnded]: () => this.onRoundEnded(),
            [EventName.OnCardLeavesPlay]: (event) => this.onCardLeavesPlay(event)
        });

        this.action('Play an event from discard')
            .cost(hifumiCost)
            .selectCard((context) => ({
                activePromptTitle: 'Choose an event',
                cardType: CardType.Event,
                controller: Players.Self,
                location: Location.ConflictDiscardPile,
                gameAction: playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayType.PlayFromHand,
                    postHandler: (eventContext) => {
                        const card = eventContext.source;
                        context.game.addMessage(msg`${card} is removed from the game by ${context.source}'s ability`);
                        context.player.moveCard(card, Location.RemovedFromGame);
                    }
                })
            }))
            .chatText((context) => msg`play an event from their discard pile (the next time it is used this round will cost ${hifumiCost.currentCost(context.player)} fate from their characters)`)
            .limit(unlimited())
            .cannotTargetFirst();
    }

    public onRoundEnded() {
        this.hifumiCost?.refreshHifumiCount();
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(event.card === this) {
            this.hifumiCost?.refreshHifumiCount();
        }
    }
}

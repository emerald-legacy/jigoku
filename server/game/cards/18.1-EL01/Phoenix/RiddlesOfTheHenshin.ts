import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { Event } from '../../../Events/Event.js';
import type Player from '../../../Player.js';
import type Ring from '../../../Ring.js';

function getNumberOfMonks(context: AbilityContext) {
    return context.player.cardsInPlay.reduce(
        (total, card) => total + (card.getType() === CardType.Character && card.hasTrait('monk') ? 1 : 0),
        0
    );
}

class Process {
    private chosenRings: Ring[] = [];
    constructor(
        private maxRings: number,
        private context: AbilityContext
    ) {}

    public promptPlayer() {
        this.context.game.promptForRingSelect(this.context.player, {
            activePromptTitle: this.promptTitle(),
            context: this.context,
            buttons: this.buttons(),
            ringCondition: (ring) =>
                ring.isConsideredClaimed(this.context.player) && !this.chosenRings.includes(ring),
            onSelect: (_player, ring) => {
                this.chosenRings.push(ring);
                if(
                    Object.values(this.context.game.rings).some(
                        (ring) =>
                            ring.isConsideredClaimed(this.context.player) &&
                            !this.chosenRings.includes(ring) &&
                            this.chosenRings.length < this.maxRings
                    )
                ) {
                    this.promptPlayer();
                    return true;
                }

                this.resolveRings(this.context.player);
                return true;
            },
            onMenuCommand: (player) => {
                this.resolveRings(player);
                return true;
            }
        });
    }

    private buttons() {
        return this.chosenRings.length > 0 ? [{ text: 'Done', arg: 'done' }] : [];
    }

    private resolveRings(player: Player) {
        this.context.game.addMessage('{0} resolves {1}', player, this.chosenRings);
        const action = this.context.game.actions.resolveRingEffect({ target: this.chosenRings, enforceOrderedResolution: true });
        const events: Event[] = [];
        action.addEventsToArray(events, this.context.game.getFrameworkContext(player));
        this.context.game.openThenEventWindow(events);
    }

    private promptTitle(): string {
        switch(this.chosenRings.length) {
            case 0:
                return 'Choose the first ring to resolve';
            case 1:
                return 'Choose the second ring to resolve';
            case 2:
                return 'Choose the third ring to resolve';
            case 3:
                return 'Choose the fourth ring to resolve';
            case 4:
            default:
                return 'Choose the fifth ring to resolve';
        }
    }
}

export default class RiddlesOfTheHenshin extends DrawCard {
    static id = 'riddles-of-the-henshin';

    setupCardAbilities() {
        this.action('Resolve ring effects')
            .condition((context) => getNumberOfMonks(context) > 0 && context.player.getClaimedRings().length > 0)
            .handler((context) => new Process(getNumberOfMonks(context), context).promptPlayer())
            .effect('resolve ring effects');
    }
}

import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type Player from '../../player.js';
import type Ring from '../../ring.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import DrawCard from '../../drawcard.js';
import { EventNames, Phases } from '../../Constants.js';

class ShibaTsukune extends DrawCard {
    static id = 'shiba-tsukune';

    setupCardAbilities() {
        this.interrupt({
            title: 'Resolve 2 rings',
            when : {
                onPhaseEnded: (event: EventPayload<typeof EventNames.OnPhaseEnded>) => event.phase === Phases.Conflict
            },
            effect: 'resolve up to 2 ring effects',
            handler: (context: TriggeredAbilityContext<any>) => (context ? this.game.promptForRingSelect(context.player, {
                activePromptTitle: 'Choose a ring to resolve',
                context: context,
                ringCondition: (ring: Ring) => ring.isUnclaimed(),
                onSelect: (player: Player, firstRing: Ring) => {
                    if(Object.values(this.game.rings).filter((ring: Ring) => ring.isUnclaimed()).length > 1) {
                        this.game.promptForRingSelect(player, {
                            activePromptTitle: 'Choose a second ring to resolve, or click Done',
                            ringCondition: (ring: Ring) => ring.isUnclaimed() && ring !== firstRing,
                            context: context,
                            optional: true,
                            onMenuCommand: (player: Player) => {
                                this.game.addMessage('{0} resolves {1}', player, firstRing);
                                let event = this.game.actions.resolveRingEffect().getEvent(firstRing, this.game.getFrameworkContext(player));
                                this.game.openThenEventWindow(event);
                                return true;
                            },
                            onSelect: (player: Player, secondRing: Ring) => {
                                this.game.addMessage('{0} resolves {1}', player, [firstRing, secondRing]);
                                let action = this.game.actions.resolveRingEffect({ target: [firstRing, secondRing]});
                                let events: any[] = [];
                                action.addEventsToArray(events, this.game.getFrameworkContext(player));
                                this.game.openThenEventWindow(events);
                                return true;
                            }
                        });
                    } else {
                        this.game.addMessage('{0} resolves {1}', context.player, firstRing);
                        let event = this.game.actions.resolveRingEffect().getEvent(firstRing, this.game.getFrameworkContext(player));
                        this.game.openThenEventWindow(event);
                    }
                    return true;
                }
            }) : undefined)
        });
    }
}


export default ShibaTsukune;

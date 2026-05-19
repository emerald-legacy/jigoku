import DrawCard from '../../drawcard.js';
import { Phases } from '../../Constants.js';

class ShibaTsukune extends DrawCard {
    static id = 'shiba-tsukune';

    setupCardAbilities() {
        this.interrupt({
            title: 'Resolve 2 rings',
            when : {
                onPhaseEnded: event => event.phase === Phases.Conflict
            },
            effect: 'resolve up to 2 ring effects',
            handler: context => this.game.promptForRingSelect(context.player, {
                activePromptTitle: 'Choose a ring to resolve',
                context: context,
                ringCondition: ring => ring.isUnclaimed(),
                onSelect: (player, firstRing) => {
                    if(Object.values(this.game.rings).filter(ring => ring.isUnclaimed()).length > 1) {
                        this.game.promptForRingSelect(player, {
                            activePromptTitle: 'Choose a second ring to resolve, or click Done',
                            ringCondition: ring => ring.isUnclaimed() && ring !== firstRing,
                            context: context,
                            optional: true,
                            onMenuCommand: player => {
                                this.game.addMessage('{0} resolves {1}', player, firstRing);
                                let event = this.game.actions.resolveRingEffect().getEvent(firstRing, this.game.getFrameworkContext(player));
                                this.game.openThenEventWindow(event);
                                return true;
                            },
                            onSelect: (player, secondRing) => {
                                this.game.addMessage('{0} resolves {1}', player, [firstRing, secondRing]);
                                let action = this.game.actions.resolveRingEffect({ target: [firstRing, secondRing]});
                                let events = [];
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
            })
        });
    }
}


export default ShibaTsukune;

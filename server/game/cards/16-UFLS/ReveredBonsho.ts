import { customFatePhaseFateRemoval } from '../../effects.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { Event } from '../../Events/Event.js';
import type Ring from '../../Ring.js';
import { placeFateOnRing } from '../../GameActions/GameActions.js';

type RingFate = { ring: Ring; fate: number };

class ReveredBonsho extends DrawCard {
    static id = 'revered-bonsho';

    setupCardAbilities() {
        this.persistentEffect({
            effect: customFatePhaseFateRemoval((player, fate) => {
                const context = this.game.getFrameworkContext();
                const ringsBase = [this.game.rings.air, this.game.rings.earth, this.game.rings.fire, this.game.rings.void, this.game.rings.water];
                let rings = ringsBase.filter(a => a.isUnclaimed());
                if(rings.length <= 0) {
                    return;
                }
                const ringFate: RingFate[] = rings.map(ring => ({
                    ring: ring,
                    fate: 0
                }));

                while(fate >= rings.length) {
                    ringFate.forEach(a => a.fate++);
                    fate = fate - rings.length;
                }

                if(fate <= 0) {
                    this.placeFate(context, player, ringFate);
                    return;
                }

                const promptForRing = () => {
                    this.game.promptForRingSelect(player, {
                        activePromptTitle: 'Choose a ring to receive fate',
                        context: context,
                        ringCondition: (ring) => rings.includes(ring),
                        onSelect: (_player, ring) => {
                            const obj = ringFate.find(a => a.ring === ring);
                            if(!obj) {
                                return true;
                            }
                            obj.fate++;
                            fate--;
                            rings = rings.filter(a => a !== ring);
                            if(fate > 0) {
                                promptForRing();
                            }
                            return true;
                        }
                    });
                };

                promptForRing();

                context.game.queueSimpleStep(() => this.placeFate(context, player, ringFate));
            })
        });
    }

    private placeFate(context: AbilityContext, targetPlayer: Player, ringFate: RingFate[]) {
        const moveEvents: Event[] = [];
        ringFate.forEach((obj) => {
            if(obj.fate > 0) {
                placeFateOnRing({ target: obj.ring, amount: obj.fate }).addEventsToArray(moveEvents, context);
                context.game.addMessage('{0} places {1} fate on the {2} due to the effects of {3}', targetPlayer, obj.fate, obj.ring, this);
            }
        });
        context.game.openThenEventWindow(moveEvents);
    }
}


export default ReveredBonsho;

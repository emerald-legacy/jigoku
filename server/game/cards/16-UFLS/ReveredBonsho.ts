import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { Event } from '../../Events/Event.js';
import type Ring from '../../Ring.js';

type RingFate = { ring: Ring; fate: number };

class ReveredBonsho extends DrawCard {
    static id = 'revered-bonsho';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.customFatePhaseFateRemoval((player: Player, fate: number) => {
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

                const ringHandler = (player: Player, ring: Ring) => {
                    const obj = ringFate.find(a => a.ring === ring);
                    if(!obj) {
                        return true;
                    }
                    obj.fate++;
                    fate--;
                    rings = rings.filter(a => a !== ring);
                    if(fate > 0) {
                        this.game.promptForRingSelect(player, {
                            activePromptTitle: 'Choose a ring to receive fate',
                            context: context,
                            ringCondition: (ring: Ring) => rings.includes(ring),
                            onSelect: ringHandler
                        });
                    }
                    return true;
                };

                this.game.promptForRingSelect(player, {
                    activePromptTitle: 'Choose a ring to receive fate',
                    context: context,
                    ringCondition: (ring: Ring) => rings.includes(ring),
                    onSelect: ringHandler
                });

                context.game.queueSimpleStep(() => this.placeFate(context, player, ringFate));
            })
        });
    }

    placeFate(context: AbilityContext, targetPlayer: Player, ringFate: RingFate[]) {
        const moveEvents: Event[] = [];
        ringFate.forEach((obj: RingFate) => {
            if(obj.fate > 0) {
                context.game.actions.placeFate({ target: obj.ring as any, amount: obj.fate }).addEventsToArray(moveEvents, context);
                context.game.addMessage('{0} places {1} fate on the {2} due to the effects of {3}', targetPlayer, obj.fate, obj.ring, this);
            }
        });
        context.game.openThenEventWindow(moveEvents);
    }
}


export default ReveredBonsho;

describe('A conflict aborted by an engine error', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    hand: ['banzai']
                },
                player2: {
                    provinces: ['shameful-display']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.banzai = this.player1.findCardByName('banzai');
            this.display = this.player2.findCardByName('shameful-display', 'province 1');
            this.game.router.handleError.and.callFake(() => undefined);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.display,
                attackers: [this.berserker],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.banzai);
            this.player1.clickCard(this.berserker);
            this.player1.clickPrompt('Done');
        });

        it('ends its effects and takes the cards out of the conflict', function() {
            expect(this.berserker.getMilitarySkill()).toBe(5);
            spyOn(this.game.currentConflict, 'determineWinner').and.throwError('test error');
            this.noMoreActions();

            expect(this.game.router.handleError).toHaveBeenCalled();
            expect(this.game.currentConflict).toBeNull();
            expect(this.berserker.inConflict).toBe(false);
            expect(this.display.inConflict).toBe(false);
            expect(this.berserker.getMilitarySkill()).toBe(3);
        });
    });
});

describe('A duel aborted by an engine error', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-makoto']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'miya-mystic'],
                    hand: ['biting-steel', 'fine-katana']
                }
            });
            this.makoto = this.player1.findCardByName('akodo-makoto');
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.bitingSteel = this.player2.findCardByName('biting-steel');
            this.katana = this.player2.findCardByName('fine-katana');
            this.game.router.handleError.and.callFake(() => undefined);
            this.player1.pass();
            this.player2.playAttachment(this.katana, this.raitsugu);
            this.player1.pass();
            this.player2.playAttachment(this.bitingSteel, this.raitsugu);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.makoto],
                defenders: [this.raitsugu]
            });
            this.player2.clickCard(this.raitsugu);
            this.player2.clickCard(this.makoto);
            this.player2.clickCard(this.bitingSteel);
            this.player2.clickCard(this.katana);
        });

        it('ends its until-end-of-duel effects', function() {
            const duelEffects = () => this.game.effectEngine.effects.filter((effect) => effect.duration === 'untilEndOfDuel');
            expect(duelEffects().length).toBe(1);
            spyOn(this.game.currentDuel, 'determineResult').and.throwError('test error');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.game.router.handleError).toHaveBeenCalled();
            expect(this.game.currentDuel).toBeNull();
            expect(duelEffects().length).toBe(0);
        });
    });
});

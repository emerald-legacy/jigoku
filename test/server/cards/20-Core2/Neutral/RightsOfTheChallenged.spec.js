describe('Rights of the Challenged', function () {
    integration(function () {
        describe('ring switch reaction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-manipulator', 'moto-youth', 'kakita-yoshi']
                    },
                    player2: {
                        inPlay: ['moto-nergui'],
                        hand: ['rights-of-the-challenged']
                    }
                });
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.manipulator = this.player1.findCardByName('bayushi-manipulator');
                this.youth = this.player1.findCardByName('moto-youth');

                this.nergui = this.player2.findCardByName('moto-nergui');
                this.rightsOfTheChallenged = this.player2.findCardByName('rights-of-the-challenged');

                this.player1.claimRing('earth');
                this.player2.claimRing('void');
            });

            it('forces attacker to change ring of attack', function () {
                this.game.rings.water.fate = 2;
                const fate = this.player1.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.manipulator, this.youth],
                    defenders: [this.nergui],
                    ring: 'air'
                });

                expect(this.player2).toHavePrompt('Any reactions?');

                this.player2.clickCard(this.rightsOfTheChallenged);
                expect(this.player1).toHavePrompt('Choose a ring to use instead');
                expect(this.player1).not.toBeAbleToSelectRing('air');
                expect(this.player1).not.toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('void');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('water');

                this.player1.clickRing('water');
                expect(this.game.currentConflict.ring.element).toBe('water');
                expect(this.player1.fate).toBe(fate);
                expect(this.game.rings.air.fate).toBe(2);
                expect(this.game.rings.water.fate).toBe(0);
                expect(this.getChatLogs(4)).toContain(
                    'player2 plays Rights of the Challenged to move all fate from the Water Ring and switch it with the contested ring'
                );
            });
        });
    });
});

describe('Rights of the Challenged\'s Duel Challenge', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-kuwanan', 'doji-whisperer'],
                    hand: ['rights-of-the-challenged']
                },
                player2: {
                    inPlay: ['kakita-toshimoko'],
                    hand: ['policy-debate']
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.rights = this.player1.findCardByName('rights-of-the-challenged');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.pd = this.player2.findCardByName('policy-debate');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash, this.kuwanan],
                defenders: [this.toshimoko]
            });
            this.player2.clickCard(this.pd);
            this.player2.clickCard(this.toshimoko);
            this.player2.clickCard(this.brash);
        });

        it('replaces the challenged character with another one at the same location', function () {
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.rights);
            this.player1.clickCard(this.rights);
            expect(this.player1).toHavePrompt('Choose a challenged character');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
            this.player1.clickCard(this.brash);
            expect(this.player1).toHavePrompt('Choose a character to replace it');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            this.player1.clickCard(this.kuwanan);

            expect(this.game.currentDuel.targets).toEqual([this.kuwanan]);
            expect(this.getChatLogs(5)).toContain('player1 plays Rights of the Challenged to replace Brash Samurai with Doji Kuwanan in the duel');
        });
    });
});


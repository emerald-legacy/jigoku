describe('Jade Infused Arrows', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'goblin-sneak', 'kaiu-envoy']
                },
                player2: {
                    inPlay: ['borderlands-defender'],
                    hand: ['jade-infused-arrows']
                }
            });

            this.borderlands = this.player2.findCardByName('borderlands-defender');
            this.arrows = this.player2.findCardByName('jade-infused-arrows');

            this.brash = this.player1.findCardByName('brash-samurai');
            this.goblin = this.player1.findCardByName('goblin-sneak');
            this.taintedEnvoy = this.player1.findCardByName('kaiu-envoy');
            this.taintedEnvoy.taint();

            this.player1.pass();
            this.player2.clickCard(this.arrows);
            this.player2.clickCard(this.borderlands);
            this.noMoreActions();
        });

        it('against normal characters', function () {
            const borderlandsMilInit = this.borderlands.militarySkill;
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.borderlands],
                type: 'military'
            });

            this.player2.clickCard(this.arrows);
            expect(this.borderlands.militarySkill).toBe(borderlandsMilInit + 2);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Jade-Infused Arrows, spending 1 fate to give +2military to Borderlands Defender'
            );
        });

        it('against corrupt characters', function () {
            const borderlandsMilInit = this.borderlands.militarySkill;
            this.initiateConflict({
                attackers: [this.goblin],
                defenders: [this.borderlands],
                type: 'military'
            });

            this.player2.clickCard(this.arrows);
            expect(this.borderlands.militarySkill).toBe(borderlandsMilInit + 4);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Jade-Infused Arrows, spending 1 fate to give +4military to Borderlands Defender - the jade is potent against the spawns of jigoku'
            );
        });

        it('against tainted characters', function () {
            const borderlandsMilInit = this.borderlands.militarySkill;
            this.initiateConflict({
                attackers: [this.taintedEnvoy],
                defenders: [this.borderlands],
                type: 'military'
            });

            this.player2.clickCard(this.arrows);
            expect(this.borderlands.militarySkill).toBe(borderlandsMilInit + 4);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Jade-Infused Arrows, spending 1 fate to give +4military to Borderlands Defender - the jade is potent against the spawns of jigoku'
            );
        });
    });
});

describe('Jade Infused Arrows by side', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['borderlands-defender', 'endless-plains-skirmisher'],
                    hand: ['jade-infused-arrows']
                }
            });

            this.borderlands = this.player2.findCardByName('borderlands-defender');
            this.arrows = this.player2.findCardByName('jade-infused-arrows');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');

            this.player1.pass();
            this.player2.playAttachment(this.arrows, this.borderlands);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.borderlands],
                type: 'military'
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
            this.borderlandsMilInit = this.borderlands.militarySkill;
        });

        it('counts your own tainted character on the enemy side', function () {
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            this.skirmisher2.taint();

            this.player2.clickCard(this.arrows);
            expect(this.borderlands.militarySkill).toBe(this.borderlandsMilInit + 4);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Jade-Infused Arrows, spending 1 fate to give +4military to Borderlands Defender - the jade is potent against the spawns of jigoku'
            );
        });

        it('does not count an opponent\'s tainted character on your side', function () {
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);
            this.skirmisher1.taint();

            this.player2.clickCard(this.arrows);
            expect(this.borderlands.militarySkill).toBe(this.borderlandsMilInit + 2);
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Jade-Infused Arrows, spending 1 fate to give +2military to Borderlands Defender'
            );
        });
    });
});

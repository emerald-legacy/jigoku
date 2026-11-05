describe('Dead Eyes Sensei', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'dead-eyes-sensei',
                        'one-of-the-forgotten',
                        'gallant-quartermaster',
                        'shrewd-yasuki',
                        'butcher-of-the-fallen'
                    ]
                },
                player2: {
                    inPlay: [{ card: 'doji-whisperer', bowed: true }]
                }
            });

            this.deadEyesSensei = this.player1.findCardByName('dead-eyes-sensei');
            this.forgottenFateless = this.player1.findCardByName('one-of-the-forgotten');
            this.gallantFateless = this.player1.findCardByName('gallant-quartermaster');
            this.shrewdFated = this.player1.findCardByName('shrewd-yasuki');
            this.shrewdFated.fate = 1;
            this.butcherFated = this.player1.findCardByName('butcher-of-the-fallen');
            this.butcherFated.fate = 1;

            this.forgottenFateless.bow();
            this.gallantFateless.bow();
            this.shrewdFated.bow();
            this.butcherFated.bow();
            this.enemyWhisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('works on any character you control', function () {
            this.player1.clickCard(this.deadEyesSensei);
            expect(this.player1).toBeAbleToSelect(this.deadEyesSensei);
            expect(this.player1).toBeAbleToSelect(this.forgottenFateless);
            expect(this.player1).toBeAbleToSelect(this.gallantFateless);
            expect(this.player1).toBeAbleToSelect(this.shrewdFated);
            expect(this.player1).toBeAbleToSelect(this.butcherFated);
            expect(this.player1).not.toBeAbleToSelect(this.enemyWhisperer);
        });

        it('readies a character, removes a fate, and makes the character a berserker', function () {
            this.player1.clickCard(this.deadEyesSensei);
            this.player1.clickCard(this.shrewdFated);

            expect(this.shrewdFated.fate).toBe(0);
            expect(this.shrewdFated.bowed).toBe(false);
            expect(this.shrewdFated.hasTrait('berserker')).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Dead Eyes Sensei to ready and remove a fate from Shrewd Yasuki, giving them the Berserker trait'
            );
        });

        it('gives Berserker only for this phase', function () {
            this.shrewdFated.fate = 2;
            this.player1.clickCard(this.deadEyesSensei);
            this.player1.clickCard(this.shrewdFated);
            expect(this.shrewdFated.hasTrait('berserker')).toBe(true);
            this.nextPhase();
            expect(this.game.currentPhase).toBe('fate');
            expect(this.shrewdFated.location).toBe('play area');
            expect(this.shrewdFated.hasTrait('berserker')).toBe(false);
        });
    });
});

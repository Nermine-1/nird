import { ShieldCheck, Brain, Search, GraduationCap, LineChart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function WelcomeScreen() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6"
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        NIRD FakeCheck
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
                        Votre copilote pour naviguer dans l'océan de l'information.
                        <br />
                        <span className="text-foreground font-medium">Distinguez le vrai du faux avec assurance.</span>
                    </p>
                </motion.div>

                {/* Main Features Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-3 gap-6"
                >
                    <motion.div variants={item} className="group p-6 rounded-2xl border bg-card/50 hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Analyse Critique</h3>
                        <p className="text-muted-foreground text-sm">
                            Ne prenez rien pour acquis. Décortiquez les sources et identifiez les biais potentiels.
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="group p-6 rounded-2xl border bg-card/50 hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                        <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Vérification Factuelle</h3>
                        <p className="text-muted-foreground text-sm">
                            Croisez les informations avec des bases de données fiables et officielles.
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="group p-6 rounded-2xl border bg-card/50 hover:bg-card/80 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                            <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Jugement Éclairé</h3>
                        <p className="text-muted-foreground text-sm">
                            Développez votre propre opinion basée sur des faits vérifiés et solides.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Activities Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
                        <GraduationCap className="w-6 h-6 text-primary" />
                        <span>Prêt à explorer ?</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-transparent hover:border-primary/20 transition-colors">
                            <div className="p-2 rounded-lg bg-background shadow-sm">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium">Posez une question</h4>
                                <p className="text-sm text-muted-foreground">Collez un lien ou un texte pour lancer une analyse instantanée.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-transparent hover:border-primary/20 transition-colors">
                            <div className="p-2 rounded-lg bg-background shadow-sm">
                                <LineChart className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium">Suivez vos progrès</h4>
                                <p className="text-sm text-muted-foreground">Visualisez votre évolution et gagnez en expertise.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
